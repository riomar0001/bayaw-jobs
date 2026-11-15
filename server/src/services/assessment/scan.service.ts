import { Config } from '@/constants/config.constant';
import { ErrorMessages } from '@/constants/errorMessages.constant';
import logger from '@/configs/logger.config';
import { addAssessmentJob } from '@/queues/assessment.queue';
import { scanRepository, targetRepository } from '@/repositories/assessment.repository';
import { storageService } from '@/services/storage.service';
import { BadRequestError, NotFoundError } from '@/utils/errors.util';
import { assertAiConfigured } from './ai/provider';
import { assertInScope, normalizeHost, parseHttpUrl, ScopedTarget } from './scope.service';
import type { Actor } from './target.service';
import { runDnsLookup } from './tools/dns.tool';
import { runHttpCheck } from './tools/httpCheck.tool';
import { parseNmapXml } from './tools/nmapImport.tool';
import { runOpenApiImport } from './tools/openapi.tool';
import type { ParsedReport, ToolResult } from './tools/types';
import { parseZapJson } from './tools/zapImport.tool';

export type StartableTool = 'HTTP_CHECK' | 'DNS' | 'OPENAPI' | 'AGENT_NMAP' | 'AGENT_ZAP';
export type ImportTool = 'NMAP' | 'ZAP';

interface WorkerParams {
  url?: string;
  host?: string;
}

async function loadTarget(targetId: string): Promise<ScopedTarget & { name: string }> {
  const target = await targetRepository.findById(targetId);
  if (!target) throw new NotFoundError(ErrorMessages.BAYAWSEC.TARGET_NOT_FOUND);
  return target;
}

function scopeActor(actor: Actor) {
  return { user_id: actor.user_id, ip_address: actor.ip_address };
}

export class ScanService {
  /** Queues a Worker check (HTTP_CHECK, DNS, OPENAPI) or an agent scan (AGENT_NMAP, AGENT_ZAP). */
  async start(
    targetId: string,
    input: { tool: StartableTool; url?: string | undefined; host?: string | undefined; ports?: string | undefined },
    actor: Actor
  ) {
    const target = await loadTarget(targetId);
    const base = parseHttpUrl(target.base_url);

    if (input.tool === 'AGENT_NMAP' || input.tool === 'AGENT_ZAP') {
      if (!Config.BAYAWSEC.SCANNER_AGENT_ENABLED) throw new BadRequestError(ErrorMessages.BAYAWSEC.AGENT_DISABLED);
      const isNmap = input.tool === 'AGENT_NMAP';
      const host = normalizeHost(input.host ?? base.hostname);
      const url = isNmap ? undefined : (input.url ?? target.base_url);
      await assertInScope(target, url ? { url } : { host }, scopeActor(actor));
      const params = isNmap ? { host, ports: input.ports ?? '80,443' } : { url };
      const scan = await scanRepository.create({
        target_id: target.id,
        tool: isNmap ? 'NMAP' : 'ZAP',
        source: 'AGENT',
        params,
        started_by: actor.user_id,
      });
      const job = await addAssessmentJob({
        type: 'AGENT_SCAN',
        ref_id: scan.id,
        payload: { tool: isNmap ? 'NMAP' : 'ZAP', ...params },
        created_by: actor.user_id,
      });
      return { scan, job };
    }

    let params: WorkerParams;
    if (input.tool === 'DNS') {
      params = { host: normalizeHost(input.host ?? base.hostname) };
      await assertInScope(target, { host: params.host }, scopeActor(actor));
    } else {
      const url =
        input.url ?? (input.tool === 'OPENAPI' ? `${base.origin}/api/docs/openapi.json` : target.base_url);
      params = { url: parseHttpUrl(url).toString() };
      await assertInScope(target, { url: params.url }, scopeActor(actor));
    }

    const scan = await scanRepository.create({
      target_id: target.id,
      tool: input.tool,
      source: 'WORKER',
      params: { ...params },
      started_by: actor.user_id,
    });
    const job = await addAssessmentJob({ type: 'RUN_CHECK', ref_id: scan.id, created_by: actor.user_id });
    return { scan, job };
  }

  /** Queue consumer entry for RUN_CHECK. Tool errors mark the scan FAILED instead of retrying. */
  async runWorkerCheck(scanId: string): Promise<void> {
    const scan = await scanRepository.findById(scanId);
    if (!scan || scan.status === 'DONE') return;
    const target = await loadTarget(scan.target_id);
    const params = (scan.params ?? {}) as WorkerParams;

    await scanRepository.markRunning(scan.id);
    try {
      // Re-check scope at run time: rules may have changed since the scan was queued.
      await assertInScope(target, params.url ? { url: params.url } : { host: params.host }, {
        user_id: scan.started_by ?? undefined,
      });

      let results: ToolResult[];
      if (scan.tool === 'HTTP_CHECK' && params.url) results = await runHttpCheck(params.url);
      else if (scan.tool === 'DNS' && params.host) results = await runDnsLookup(params.host);
      else if (scan.tool === 'OPENAPI' && params.url) results = await runOpenApiImport(params.url);
      else throw new Error(`Scan ${scan.id} has an unsupported tool/params combination`);

      await scanRepository.addResults(scan.id, results);
      await scanRepository.markDone(scan.id);
      logger.info('BayawSec check finished', { scanId, tool: scan.tool, results: results.length });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await scanRepository.markFailed(scan.id, message);
      logger.warn('BayawSec check failed', { scanId, tool: scan.tool, message });
    }
  }

  /**
   * Imports an Nmap XML or ZAP JSON report (uploaded by the assessor, or posted by the agent).
   * Every host the report mentions must be in scope, or nothing is stored.
   */
  async importReport(
    targetId: string,
    tool: ImportTool,
    file: { buffer: Buffer; originalname: string },
    actor: Actor,
    existingScanId?: string
  ) {
    const target = await loadTarget(targetId);
    const text = file.buffer.toString('utf8');

    let report: ParsedReport;
    try {
      report = tool === 'NMAP' ? parseNmapXml(text) : parseZapJson(text);
    } catch (error) {
      throw new BadRequestError(
        `${ErrorMessages.BAYAWSEC.IMPORT_INVALID}: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    const seen = new Set<string>();
    for (const entry of report.hosts) {
      const key = `${entry.host}:${entry.port ?? ''}`;
      if (seen.has(key)) continue;
      seen.add(key);
      await assertInScope(target, { host: entry.host, port: entry.port }, scopeActor(actor));
    }

    const scan =
      existingScanId !== undefined
        ? await scanRepository.markRunning(existingScanId)
        : await scanRepository.create({
            target_id: target.id,
            tool,
            source: 'IMPORT',
            status: 'RUNNING',
            params: { filename: file.originalname.slice(0, 200) },
            started_by: actor.user_id,
          });

    const extension = tool === 'NMAP' ? 'xml' : 'json';
    const key = await storageService.uploadAssessmentFile(
      `${target.id}/scans/${scan.id}.${extension}`,
      new Uint8Array(file.buffer),
      tool === 'NMAP' ? 'application/xml' : 'application/json'
    );
    await scanRepository.addResults(scan.id, report.results);
    const done = await scanRepository.markDone(scan.id, key);
    return { scan: done, results: report.results.length };
  }

  /** Queues Feature 1 (AI interpretation). Fails fast instead of spending an AI call on nothing. */
  async requestInterpret(scanId: string, actor: Actor) {
    assertAiConfigured();
    const scan = await this.get(scanId);
    if (scan.status !== 'DONE') throw new BadRequestError(ErrorMessages.BAYAWSEC.SCAN_NOT_DONE);
    if (scan.results.length === 0) throw new BadRequestError(ErrorMessages.BAYAWSEC.SCAN_HAS_NO_RESULTS);
    return addAssessmentJob({ type: 'INTERPRET', ref_id: scan.id, created_by: actor.user_id });
  }

  async listForTarget(targetId: string) {
    await loadTarget(targetId);
    return scanRepository.findByTarget(targetId);
  }

  async get(scanId: string) {
    const scan = await scanRepository.findByIdWithResults(scanId);
    if (!scan) throw new NotFoundError(ErrorMessages.BAYAWSEC.SCAN_NOT_FOUND);
    return scan;
  }

  async downloadRaw(scanId: string) {
    const scan = await scanRepository.findById(scanId);
    if (!scan?.raw_output_key) throw new NotFoundError(ErrorMessages.STORAGE.FILE_NOT_FOUND);
    return storageService.downloadAssessmentFile(scan.raw_output_key);
  }
}

export const scanService = new ScanService();
