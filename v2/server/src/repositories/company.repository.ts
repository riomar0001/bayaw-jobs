import prisma from '@/configs/prisma.config';

const COMPANY_INCLUDE = {
  companyContacts: true,
  companySocialLinks: true,
  companyLocations: true,
  companyAdmins: true,
} as const;

export interface CreateCompanyData {
  user_id: string;
  company_name: string;
  industry: string;
  about: string;
  company_size: string;
  foundation_year: number;
  website: string;
  logo: string | null;
  owner_position: string;
  contact: { email: string; phone: string };
  social_links?: { platform: 'FACEBOOK' | 'TWITTER' | 'LINKEDIN' | 'INSTAGRAM'; url: string }[];
  locations?: {
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  }[];
}

export class CompanyRepository {
  async findByUserId(userId: string) {
    return prisma.company_information.findFirst({
      where: { user_id: userId },
      include: COMPANY_INCLUDE,
    });
  }

  async findCompanyIdByAdminUserId(userId: string) {
    return prisma.company_admin.findFirst({
      where: { user_id: userId },
      select: { company_id: true },
    });
  }

  async findById(id: string) {
    return prisma.company_information.findUnique({
      where: { id },
      include: COMPANY_INCLUDE,
    });
  }

  async updateLogo(id: string, logo: string) {
    return prisma.company_information.update({
      where: { id },
      data: { logo },
    });
  }

  async findAllAdminsByCompany(companyId: string) {
    return prisma.company_admin.findMany({
      where: { company_id: companyId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: { created_at: 'asc' },
    });
  }

  async findAdminByUserAndCompany(userId: string, companyId: string) {
    return prisma.company_admin.findFirst({
      where: { user_id: userId, company_id: companyId },
    });
  }

  async findAdminById(adminId: string) {
    return prisma.company_admin.findUnique({
      where: { id: adminId },
    });
  }

  async addAdmin(data: {
    company_id: string;
    user_id: string;
    role: string;
    position?: string;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
  }) {
    return prisma.company_admin.create({ data });
  }

  async removeAdmin(adminId: string) {
    return prisma.company_admin.delete({ where: { id: adminId } });
  }

  async findTopCompanies(limit: number = 6) {
    return prisma.company_information.findMany({
      take: limit,
      orderBy: {
        jobs: { _count: 'desc' },
      },
      select: {
        id: true,
        company_name: true,
        industry: true,
        company_size: true,
        logo: true,
        website: true,
        _count: { select: { jobs: { where: { status: 'OPEN' } } } },
      },
    });
  }

  async getCompanyDashboard(companyId: string) {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setHours(0, 0, 0, 0);
    startOfThisWeek.setDate(now.getDate() - daysToMonday);

    const eightWeeksAgo = new Date(startOfThisWeek);
    eightWeeksAgo.setDate(startOfThisWeek.getDate() - 49);

    const [
      total_jobs,
      total_applicants,
      new_applicants_this_week,
      interviewed_applicants,
      pipelineGroups,
      recentApplications,
      recentJobs,
      trendApplications,
    ] = await Promise.all([
      prisma.job.count({ where: { company_id: companyId } }),
      prisma.applicant_applied_job.count({ where: { job: { company_id: companyId } } }),
      prisma.applicant_applied_job.count({
        where: { job: { company_id: companyId }, application_date: { gte: startOfThisWeek } },
      }),
      prisma.applicant_applied_job.count({
        where: { job: { company_id: companyId }, status: 'INTERVIEW' },
      }),
      prisma.applicant_applied_job.groupBy({
        by: ['status'],
        where: { job: { company_id: companyId } },
        _count: { status: true },
      }),
      prisma.applicant_applied_job.findMany({
        where: { job: { company_id: companyId } },
        take: 5,
        orderBy: { application_date: 'desc' },
        select: {
          id: true,
          status: true,
          application_date: true,
          applicant_profile: {
            select: {
              first_name: true,
              last_name: true,
              desired_position: true,
              profile_picture: true,
            },
          },
          job: {
            select: { id: true, title: true, department: true },
          },
        },
      }),
      prisma.job.findMany({
        where: { company_id: companyId },
        take: 5,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          title: true,
          department: true,
          location: true,
          employment_type: true,
          location_type: true,
          status: true,
          created_at: true,
          _count: { select: { applicant_applied_job: true } },
        },
      }),
      prisma.applicant_applied_job.findMany({
        where: {
          job: { company_id: companyId },
          application_date: { gte: eightWeeksAgo },
        },
        select: { application_date: true },
      }),
    ]);

    // Build 8-week trend buckets (oldest → newest)
    const weeks = Array.from({ length: 8 }, (_, i) => {
      const weekStart = new Date(startOfThisWeek);
      weekStart.setDate(startOfThisWeek.getDate() - (7 - i) * 7);
      return { week_start: new Date(weekStart), count: 0 };
    });

    for (const app of trendApplications) {
      const appDate = new Date(app.application_date);
      for (let i = weeks.length - 1; i >= 0; i--) {
        const weekEnd = new Date(weeks[i].week_start);
        weekEnd.setDate(weeks[i].week_start.getDate() + 7);
        if (appDate >= weeks[i].week_start && appDate < weekEnd) {
          weeks[i].count++;
          break;
        }
      }
    }

    const ALL_STATUSES = ['NEW', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'] as const;
    const pipelineMap = new Map(pipelineGroups.map((g) => [g.status, g._count.status]));
    const application_pipeline = ALL_STATUSES.map((status) => {
      const count = pipelineMap.get(status) ?? 0;
      const percentage = total_applicants > 0 ? Math.round((count / total_applicants) * 100) : 0;
      return { status, count, percentage };
    });

    return {
      summary: { total_jobs, total_applicants, new_applicants_this_week, interviewed_applicants },
      application_pipeline,
      applicant_trends: weeks.map((w) => ({
        week_start: w.week_start.toISOString().split('T')[0],
        count: w.count,
      })),
      recent_applicants: recentApplications,
      recent_jobs: recentJobs.map(({ _count, ...job }) => ({
        ...job,
        applicant_count: _count.applicant_applied_job,
      })),
    };
  }

  async getJobPostingStats(companyId: string) {
    const [total_jobs, active_jobs, closed_jobs, total_applicants] = await prisma.$transaction([
      prisma.job.count({ where: { company_id: companyId } }),
      prisma.job.count({ where: { company_id: companyId, status: 'OPEN' } }),
      prisma.job.count({ where: { company_id: companyId, status: 'CLOSED' } }),
      prisma.applicant_applied_job.count({ where: { job: { company_id: companyId } } }),
    ]);

    return { total_jobs, active_jobs, closed_jobs, total_applicants };
  }

  async getApplicantStats(companyId: string) {
    const [total_applicants, in_interview, hired, rejected] = await prisma.$transaction([
      prisma.applicant_applied_job.count({ where: { job: { company_id: companyId } } }),
      prisma.applicant_applied_job.count({
        where: { job: { company_id: companyId }, status: 'INTERVIEW' },
      }),
      prisma.applicant_applied_job.count({
        where: { job: { company_id: companyId }, status: 'HIRED' },
      }),
      prisma.applicant_applied_job.count({
        where: { job: { company_id: companyId }, status: 'REJECTED' },
      }),
    ]);

    return { total_applicants, in_interview, hired, rejected };
  }

  async createCompany(data: CreateCompanyData) {
    return prisma.company_information.create({
      data: {
        user_id: data.user_id,
        company_name: data.company_name,
        industry: data.industry,
        about: data.about,
        company_size: data.company_size,
        foundation_year: data.foundation_year,
        website: data.website,
        logo: data.logo,
        companyContacts: {
          create: {
            email: data.contact.email,
            phone: data.contact.phone,
          },
        },
        ...(data.social_links && data.social_links.length > 0
          ? { companySocialLinks: { create: data.social_links } }
          : {}),
        ...(data.locations && data.locations.length > 0
          ? { companyLocations: { create: data.locations } }
          : {}),
        companyAdmins: {
          create: {
            user_id: data.user_id,
            role: 'OWNER',
            position: data.owner_position,
            can_create: true,
            can_read: true,
            can_update: true,
            can_delete: true,
          },
        },
      },
      include: COMPANY_INCLUDE,
    });
  }
}

export const companyRepository = new CompanyRepository();
export default companyRepository;
