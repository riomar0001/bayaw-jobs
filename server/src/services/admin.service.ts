import prisma from '@/configs/prisma.config';
import { job_status } from '@/generated/prisma/client';

export class AdminService {
  async getOverview() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const now = new Date();

    const [
      total_users,
      total_businesses,
      total_applicants,
      total_jobs,
      total_applications,
      new_users_this_week,
      locked_accounts,
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
      prisma.user.count({ where: { locked_until: { gt: now } } }),

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
        locked_accounts,
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

  async getUsers() {
    const [users, admins, company_owners, pending_verification] = await Promise.all([
      prisma.user.findMany({
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          role: true,
          status: true,
          email_verified: true,
          created_at: true,
          last_login_at: true,
          locked_until: true,
        },
      }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'COMPANY_OWNER' } }),
      prisma.user.count({ where: { status: 'PENDING_VERIFICATION' } }),
    ]);

    return {
      stats: {
        total: users.length,
        admins,
        company_owners,
        applicants: users.length - admins - company_owners,
        pending_verification,
      },
      users,
    };
  }

  async getBusinesses() {
    const businesses = await prisma.company_information.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        company_name: true,
        industry: true,
        company_size: true,
        website: true,
        created_at: true,
        _count: { select: { jobs: true } },
        jobs: {
          where: { status: job_status.OPEN },
          select: { id: true },
        },
      },
    });

    const industries = [...new Set(businesses.map((b) => b.industry))].sort();
    const totalOpenJobs = businesses.reduce((acc, b) => acc + b.jobs.length, 0);
    const totalJobs = businesses.reduce((acc, b) => acc + b._count.jobs, 0);

    return {
      stats: {
        total: businesses.length,
        total_open_jobs: totalOpenJobs,
        total_jobs: totalJobs,
        industries,
      },
      businesses: businesses.map(({ jobs, _count, ...b }) => ({
        ...b,
        open_jobs_count: jobs.length,
        total_jobs_count: _count.jobs,
      })),
    };
  }

  async getApplicants() {
    const applicants = await prisma.applicant_profile.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        desired_position: true,
        location: true,
        created_at: true,
        user: { select: { first_name: true, last_name: true, email: true } },
        applicantCareerStatuses: {
          orderBy: { created_at: 'desc' },
          take: 1,
          select: { status: true },
        },
        _count: { select: { applicantAppliedJobs: true } },
      },
    });

    const totalApplications = applicants.reduce(
      (acc, a) => acc + a._count.applicantAppliedJobs,
      0,
    );
    const activelyLooking = applicants.filter(
      (a) => a.applicantCareerStatuses[0]?.status === 'ACTIVELY_LOOKING',
    ).length;

    return {
      stats: {
        total: applicants.length,
        actively_looking: activelyLooking,
        total_applications: totalApplications,
        avg_applications_per_applicant:
          applicants.length > 0
            ? Math.round((totalApplications / applicants.length) * 10) / 10
            : 0,
      },
      applicants: applicants.map(({ user, applicantCareerStatuses, _count, ...a }) => ({
        ...a,
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email,
        career_status: applicantCareerStatuses[0]?.status ?? null,
        applications_count: _count.applicantAppliedJobs,
      })),
    };
  }

  async getJobs() {
    const jobs = await prisma.job.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        department: true,
        location: true,
        location_type: true,
        employment_type: true,
        status: true,
        created_at: true,
        company_information: { select: { company_name: true } },
        _count: { select: { applicant_applied_job: true } },
      },
    });

    const open = jobs.filter((j) => j.status === job_status.OPEN).length;
    const closed = jobs.filter((j) => j.status === job_status.CLOSED).length;
    const draft = jobs.filter((j) => j.status === job_status.DRAFT).length;
    const paused = jobs.filter((j) => j.status === job_status.PAUSED).length;
    const totalApplications = jobs.reduce((acc, j) => acc + j._count.applicant_applied_job, 0);

    return {
      stats: {
        total: jobs.length,
        open,
        closed,
        draft,
        paused,
        total_applications: totalApplications,
      },
      jobs: jobs.map(({ company_information, _count, ...j }) => ({
        ...j,
        company_name: company_information?.company_name ?? '—',
        applicant_count: _count.applicant_applied_job,
      })),
    };
  }
}

export const adminService = new AdminService();
