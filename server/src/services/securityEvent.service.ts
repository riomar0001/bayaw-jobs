import { security_event_type, security_event_severity } from '@/generated/prisma/client';
import {
  securityEventRepository,
  SecurityEventFilters,
} from '@/repositories/securityEvent.repository';
import { logger } from '@/configs/logger.config';

const SEVERITY_MAP: Record<security_event_type, security_event_severity> = {
  LOGIN_FAILED:              security_event_severity.MEDIUM,
  ACCOUNT_LOCKED:            security_event_severity.HIGH,
  ACCOUNT_UNLOCKED:          security_event_severity.LOW,
  RATE_LIMITED:              security_event_severity.MEDIUM,
  LOGIN_SUCCESS:             security_event_severity.LOW,
  PASSWORD_CHANGED:          security_event_severity.MEDIUM,
  PASSWORD_RESET_REQUESTED:  security_event_severity.MEDIUM,
  EMAIL_VERIFIED:            security_event_severity.LOW,
  SUSPICIOUS_ACTIVITY:       security_event_severity.CRITICAL,
};

export class SecurityEventService {
  async log(
    type: security_event_type,
    opts: {
      user_id?: string | undefined;
      ip_address?: string | undefined;
      user_agent?: string | undefined;
      metadata?: Record<string, unknown> | undefined;
      severity?: security_event_severity | undefined;
    } = {},
  ) {
    const severity = opts.severity ?? SEVERITY_MAP[type];
    try {
      await securityEventRepository.create({
        type,
        severity,
        ...(opts.user_id   && { user_id:    opts.user_id }),
        ...(opts.ip_address && { ip_address: opts.ip_address }),
        ...(opts.user_agent && { user_agent: opts.user_agent }),
        ...(opts.metadata   && { metadata:   opts.metadata }),
      });
    } catch (err) {
      logger.error('Failed to persist security event', { type, err });
    }
  }

  async getEvents(filters: SecurityEventFilters) {
    return securityEventRepository.findMany(filters);
  }

  async getStats() {
    return securityEventRepository.getStats();
  }
}

export const securityEventService = new SecurityEventService();
