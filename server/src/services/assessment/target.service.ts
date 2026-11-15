import { ErrorMessages } from '@/constants/errorMessages.constant';
import { targetRepository } from '@/repositories/assessment.repository';
import { NotFoundError } from '@/utils/errors.util';
import { scope_asset_type } from '@/generated/prisma/client';
import { assertHostAllowed, normalizeHost, parseHttpUrl } from './scope.service';

export interface Actor {
  user_id?: string | undefined;
  email?: string | undefined;
  ip_address?: string | undefined;
}

export class TargetService {
  async create(
    input: {
      name: string;
      base_url: string;
      description?: string | undefined;
      authorization_note?: string | undefined;
      test_window_start?: Date | undefined;
      test_window_end?: Date | undefined;
    },
    actor: Actor
  ) {
    const url = parseHttpUrl(input.base_url);
    assertHostAllowed(url.hostname);
    return targetRepository.create({
      ...input,
      base_url: url.origin + (url.pathname === '/' ? '' : url.pathname.replace(/\/$/, '')),
      created_by: actor.user_id,
      created_by_email: actor.email,
    });
  }

  list() {
    return targetRepository.findMany();
  }

  async get(id: string) {
    const target = await targetRepository.findById(id);
    if (!target) throw new NotFoundError(ErrorMessages.BAYAWSEC.TARGET_NOT_FOUND);
    return target;
  }

  async update(
    id: string,
    input: {
      name?: string | undefined;
      description?: string | undefined;
      authorization_note?: string | undefined;
      test_window_start?: Date | undefined;
      test_window_end?: Date | undefined;
    }
  ) {
    await this.get(id);
    return targetRepository.update(id, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.authorization_note !== undefined && { authorization_note: input.authorization_note }),
      ...(input.test_window_start !== undefined && { test_window_start: input.test_window_start }),
      ...(input.test_window_end !== undefined && { test_window_end: input.test_window_end }),
    });
  }

  async addScopeRule(
    targetId: string,
    input: { asset_type: scope_asset_type; value: string; in_scope: boolean; notes?: string | undefined }
  ) {
    await this.get(targetId);
    let value = input.value.trim();
    // In-scope host/URL rules can never widen scope past the env allowlist.
    if (input.asset_type === 'HOST') {
      value = normalizeHost(value);
      if (input.in_scope) assertHostAllowed(value);
    }
    if (input.asset_type === 'URL') {
      const url = parseHttpUrl(value);
      if (input.in_scope) assertHostAllowed(url.hostname);
      value = url.toString();
    }
    return targetRepository.addScopeRule({ target_id: targetId, ...input, value });
  }

  async deleteScopeRule(targetId: string, ruleId: string) {
    const { count } = await targetRepository.deleteScopeRule(targetId, ruleId);
    if (count === 0) throw new NotFoundError('Scope rule not found');
  }
}

export const targetService = new TargetService();
