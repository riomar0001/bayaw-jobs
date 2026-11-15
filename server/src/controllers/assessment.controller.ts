import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ErrorMessages } from '@/constants/errorMessages.constant';
import { agentService } from '@/services/assessment/agent.service';
import { findingService } from '@/services/assessment/finding.service';
import { insightsService } from '@/services/assessment/insights.service';
import { scanService } from '@/services/assessment/scan.service';
import { Actor, targetService } from '@/services/assessment/target.service';
import { createdResponse, paginatedResponse, successResponse } from '@/utils/apiResponse.util';
import { BadRequestError } from '@/utils/errors.util';
import * as V from '@/validations/assessment.validation';

type Handler = (req: Request, res: Response) => Promise<void>;

/** `validate()` only checks the request; re-parse here to get typed, coerced values. */
function parse<S extends z.ZodTypeAny>(schema: S, req: Request): z.infer<S> {
  return schema.parse({ body: req.body, query: req.query, params: req.params, cookies: req.cookies });
}

function actor(req: Request): Actor {
  return { user_id: req.user?.user_id, email: req.user?.email, ip_address: req.ip };
}

function wrap(handler: Handler) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

function sendFile(res: Response, file: { buffer: Buffer; contentType: string }, filename: string) {
  res.setHeader('content-type', file.contentType);
  res.setHeader('content-disposition', `attachment; filename="${filename}"`);
  res.setHeader('x-content-type-options', 'nosniff');
  res.send(file.buffer);
}

export class AssessmentController {
  // ─── Targets & scope ────────────────────────────────────────────────────────

  createTarget = wrap(async (req, res) => {
    const { body } = parse(V.createTargetSchema, req);
    createdResponse(res, await targetService.create(body, actor(req)), 'Assessment target created');
  });

  listTargets = wrap(async (_req, res) => {
    successResponse(res, await targetService.list(), 'Assessment targets retrieved');
  });

  getTarget = wrap(async (req, res) => {
    const { params } = parse(V.targetIdSchema, req);
    successResponse(res, await targetService.get(params.id), 'Assessment target retrieved');
  });

  updateTarget = wrap(async (req, res) => {
    const { params, body } = parse(V.updateTargetSchema, req);
    successResponse(res, await targetService.update(params.id, body), 'Assessment target updated');
  });

  addScopeRule = wrap(async (req, res) => {
    const { params, body } = parse(V.addScopeRuleSchema, req);
    createdResponse(res, await targetService.addScopeRule(params.id, body), 'Scope rule added');
  });

  deleteScopeRule = wrap(async (req, res) => {
    const { params } = parse(V.scopeRuleIdSchema, req);
    await targetService.deleteScopeRule(params.id, params.ruleId);
    successResponse(res, null, 'Scope rule removed');
  });

  // ─── Scans & imports ────────────────────────────────────────────────────────

  startScan = wrap(async (req, res) => {
    const { params, body } = parse(V.startScanSchema, req);
    const result = await scanService.start(params.id, body, actor(req));
    successResponse(res, result, 'Scan queued', 202);
  });

  importReport = wrap(async (req, res) => {
    const { params } = parse(V.importReportSchema, req);
    if (!req.file) throw new BadRequestError(ErrorMessages.BAYAWSEC.IMPORT_FILE_REQUIRED);
    const tool = params.tool === 'nmap' ? 'NMAP' : 'ZAP';
    const result = await scanService.importReport(params.id, tool, req.file, actor(req));
    createdResponse(res, result, `${tool} report imported`);
  });

  listScans = wrap(async (req, res) => {
    const { params } = parse(V.targetIdSchema, req);
    successResponse(res, await scanService.listForTarget(params.id), 'Scans retrieved');
  });

  getScan = wrap(async (req, res) => {
    const { params } = parse(V.scanIdSchema, req);
    successResponse(res, await scanService.get(params.id), 'Scan retrieved');
  });

  downloadScanRaw = wrap(async (req, res) => {
    const { params } = parse(V.scanIdSchema, req);
    sendFile(res, await scanService.downloadRaw(params.id), `scan-${params.id}`);
  });

  // ─── AI ─────────────────────────────────────────────────────────────────────

  interpretScan = wrap(async (req, res) => {
    const { params } = parse(V.scanIdSchema, req);
    const job = await scanService.requestInterpret(params.id, actor(req));
    successResponse(res, { job }, 'AI interpretation queued. Poll GET jobs/:id, then GET scans/:id/ai.', 202);
  });

  scanAnalyses = wrap(async (req, res) => {
    const { params } = parse(V.scanIdSchema, req);
    successResponse(res, await insightsService.scanAnalyses(params.id), 'AI analyses retrieved');
  });

  requestRemediation = wrap(async (req, res) => {
    const { params } = parse(V.findingIdSchema, req);
    const job = await findingService.requestRemediation(params.id, actor(req));
    successResponse(res, { job }, 'AI remediation queued. Poll GET jobs/:id, then GET findings/:id/ai.', 202);
  });

  findingAnalyses = wrap(async (req, res) => {
    const { params } = parse(V.findingIdSchema, req);
    successResponse(res, await findingService.aiAnalyses(params.id), 'AI analyses retrieved');
  });

  getJob = wrap(async (req, res) => {
    const { params } = parse(V.jobIdSchema, req);
    successResponse(res, await insightsService.job(params.id), 'Job retrieved');
  });

  // ─── Findings ───────────────────────────────────────────────────────────────

  listFindings = wrap(async (req, res) => {
    const { query } = parse(V.listFindingsSchema, req);
    const { items, total } = await findingService.list(query);
    paginatedResponse(res, items, query.page, query.limit, total, 'Findings retrieved');
  });

  createFinding = wrap(async (req, res) => {
    const { body } = parse(V.createFindingSchema, req);
    createdResponse(res, await findingService.createManual(body, actor(req)), 'Finding created');
  });

  getFinding = wrap(async (req, res) => {
    const { params } = parse(V.findingIdSchema, req);
    successResponse(res, await findingService.get(params.id), 'Finding retrieved');
  });

  verifyFinding = wrap(async (req, res) => {
    const { params, body } = parse(V.verifyFindingSchema, req);
    successResponse(res, await findingService.verify(params.id, body, actor(req)), 'Finding verified');
  });

  setRemediation = wrap(async (req, res) => {
    const { params, body } = parse(V.setRemediationSchema, req);
    successResponse(res, await findingService.setRemediation(params.id, body), 'Remediation saved');
  });

  addEvidence = wrap(async (req, res) => {
    const { params, body } = parse(V.addEvidenceSchema, req);
    const file = req.file ? { buffer: req.file.buffer, mimetype: req.file.mimetype } : undefined;
    createdResponse(res, await findingService.addEvidence(params.id, { ...body, file }, actor(req)), 'Evidence added');
  });

  downloadEvidence = wrap(async (req, res) => {
    const { params } = parse(V.evidenceIdSchema, req);
    sendFile(res, await findingService.downloadEvidence(params.id), `evidence-${params.id}`);
  });

  // ─── Dashboard & report ─────────────────────────────────────────────────────

  dashboard = wrap(async (req, res) => {
    const { query } = parse(V.dashboardSchema, req);
    successResponse(res, await insightsService.dashboard(query.target_id), 'Dashboard retrieved');
  });

  report = wrap(async (req, res) => {
    const { params } = parse(V.targetIdSchema, req);
    successResponse(res, await insightsService.report(params.id), 'Report data retrieved');
  });

  // ─── Scanner agent (bearer token, see requireScannerAgent) ─────────────────

  agentConfig = wrap(async (_req, res) => {
    successResponse(res, agentService.config(), 'Agent config');
  });

  agentClaim = wrap(async (_req, res) => {
    const job = await agentService.claimNext();
    successResponse(res, job, job ? 'Job claimed' : 'No jobs waiting');
  });

  agentResult = wrap(async (req, res) => {
    const { params, body } = parse(V.agentResultSchema, req);
    const file = req.file ? { buffer: req.file.buffer, originalname: req.file.originalname } : undefined;
    successResponse(res, await agentService.submitResult(params.id, { file, error: body.error }), 'Result received');
  });
}

export const assessmentController = new AssessmentController();
