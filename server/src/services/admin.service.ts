import prisma from '@/configs/prisma.config';
import { job_status } from '@/generated/prisma/client';

export class AdminService {
  async getOverview() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      total_users,
      total_businesses,
      total_applicants,
      total_jobs,
      total_applications,
      new_users_this_week,
      recent_users,
      recent_businesses,
      recent_applicants,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.company_information.count(),
      prisma.applicant_profile.count(),
      prisma.job.count(),
      prisma.applicant_applied_job.count(),
      prisma.user.count({ where: { created_at: { gte: oneWeekAgo } } }),

      prisma.user.findMany({
        take: 8,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          role: true,
          status: true,
          created_at: true,
        },
      }),

      prisma.company_information.findMany({
        take: 8,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          company_name: true,
          industry: true,
          company_size: true,
          created_at: true,
          _count: { select: { jobs: { where: { status: job_status.OPEN } } } },
        },
      }),

      prisma.applicant_profile.findMany({
        take: 8,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          user_id: true,
          desired_position: true,
          location: true,
          created_at: true,
          user: { select: { first_name: true, last_name: true } },
          applicantCareerStatuses: {
            orderBy: { created_at: 'desc' },
            take: 1,
            select: { status: true },
          },
          _count: { select: { applicantAppliedJobs: true } },
        },
      }),
    ]);

    return {
      stats: {
        total_users,
        total_businesses,
        total_applicants,
        total_jobs,
        total_applications,
        new_users_this_week,
      },
      recent_users,
      recent_businesses: recent_businesses.map(({ _count, ...b }) => ({
        ...b,
        open_jobs_count: _count.jobs,
      })),
      recent_applicants: recent_applicants.map(
        ({ user, applicantCareerStatuses, _count, ...a }) => ({
          ...a,
          first_name: user.first_name ?? '',
          last_name: user.last_name ?? '',
          career_status: applicantCareerStatuses[0]?.status ?? null,
          applications_count: _count.applicantAppliedJobs,
        }),
      ),
    };
  }
}

export const adminService = new AdminService();
