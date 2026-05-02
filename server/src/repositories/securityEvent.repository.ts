import prisma from '@/configs/prisma.config';
import { security_event_type, security_event_severity, Prisma } from '@/generated/prisma/client';

export interface CreateSecurityEventInput {
  type: security_event_type;
  severity: security_event_severity;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
}

export interface SecurityEventFilters {
  type?: security_event_type;
  severity?: security_event_severity;
  user_id?: string;
  from?: Date;
  to?: Date;
  page?: number;
  limit?: number;
}

export class SecurityEventRepository {
  async create(data: CreateSecurityEventInput) {
    const createData: Prisma.security_eventCreateInput = {
      type: data.type,
      severity: data.severity,
      ip_address: data.ip_address ?? null,
      user_agent: data.user_agent ?? null,
      metadata: (data.metadata as Prisma.InputJsonValue) ?? null,
      ...(data.user_id && { user: { connect: { id: data.user_id } } }),
    };
    return prisma.security_event.create({ data: createData });
  }

  async findMany(filters: SecurityEventFilters = {}) {
    const { type, severity, user_id, from, to, page = 1, limit = 50 } = filters;

    const where = {
      ...(type && { type }),
      ...(severity && { severity }),
      ...(user_id && { user_id }),
      ...((from || to) && {
        created_at: {
          ...(from && { gte: from }),
          ...(to && { lte: to }),
        },
      }),
    };

    const [events, total] = await Promise.all([
      prisma.security_event.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, first_name: true, last_name: true, email: true },
          },
        },
      }),
      prisma.security_event.count({ where }),
    ]);

    return { events, total, page, limit };
  }

  async getStats() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [total, last24h, byType, bySeverity] = await Promise.all([
      prisma.security_event.count(),
      prisma.security_event.count({ where: { created_at: { gte: oneDayAgo } } }),
      prisma.security_event.groupBy({ by: ['type'], _count: { type: true } }),
      prisma.security_event.groupBy({ by: ['severity'], _count: { severity: true } }),
    ]);

    return {
      total,
      last24h,
      by_type: Object.fromEntries(byType.map((r) => [r.type, r._count.type])),
      by_severity: Object.fromEntries(bySeverity.map((r) => [r.severity, r._count.severity])),
    };
  }
}

export const securityEventRepository = new SecurityEventRepository();
