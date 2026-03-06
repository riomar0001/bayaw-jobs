import prisma from '@/configs/prisma.config';
import { Prisma, location_type, employment_type, job_status } from '@/generated/prisma/client';

export interface CreateJobData {
  title: string;
  department: string;
  location: string;
  location_type: location_type;
  employment_type: employment_type;
  minimum_salary: string;
  maximum_salary: string;
  currency: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  company_id: string;
  status?: job_status | undefined;
}

export class JobRepository {
  async findById(id: string) {
    return prisma.job.findUnique({
      where: { id },
    });
  }

  async findByTitle(title: string) {
    return prisma.job.findFirst({
      where: { title },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    employment_type?: employment_type;
    location_type?: location_type;
    location?: string;
    min_salary?: number;
    max_salary?: number;
    search?: string;
  } = {}) {
    const { page = 1, limit = 10, employment_type, location_type: locType, location, min_salary, max_salary, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.jobWhereInput = {
      status: job_status.OPEN,
      ...(employment_type && { employment_type }),
      ...(locType && { location_type: locType }),
      ...(location && { location: { contains: location, mode: 'insensitive' } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { department: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          title: true,
          department: true,
          location: true,
          location_type: true,
          employment_type: true,
          minimum_salary: true,
          maximum_salary: true,
          currency: true,
          status: true,
          created_at: true,
          company_id: true,
        },
      }),
      prisma.job.count({ where }),
    ]);

    const minSal = min_salary;
    const maxSal = max_salary;
    const filtered = (minSal !== undefined || maxSal !== undefined)
      ? jobs.filter((j) => {
          const jMin = parseFloat(j.minimum_salary);
          const jMax = parseFloat(j.maximum_salary);
          if (minSal !== undefined && jMax < minSal) return false;
          if (maxSal !== undefined && jMin > maxSal) return false;
          return true;
        })
      : jobs;

    return {
      data: filtered,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async findPopularJobs(limit: number = 4) {
    return prisma.job.findMany({
      where: { status: job_status.OPEN },
      take: limit,
      orderBy: { applicant_applied_job: { _count: 'desc' } },
      select: {
        id: true,
        title: true,
        department: true,
        location: true,
        location_type: true,
        employment_type: true,
        minimum_salary: true,
        maximum_salary: true,
        currency: true,
        status: true,
        created_at: true,
        company_id: true,
        _count: { select: { applicant_applied_job: true } },
      },
    });
  }

  async findByIdWithApplicants(id: string, company_id: string) {
    return prisma.job.findUnique({
      where: { id, company_id },
      include: {
        applicant_applied_job: {
          include: {
            applicant_profile: true,
          },
          orderBy: { application_date: 'desc' },
        },
      },
    });
  }

  async findAllByCompany(company_id: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: { company_id },
        skip,
        take: limit,
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
      prisma.job.count({ where: { company_id } }),
    ]);

    return {
      data: jobs.map(({ _count, ...job }) => ({
        ...job,
        applicant_count: _count.applicant_applied_job,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async create(data: CreateJobData) {
    return prisma.job.create({
      data: {
        title: data.title,
        department: data.department,
        location: data.location,
        location_type: data.location_type,
        employment_type: data.employment_type,
        minimum_salary: data.minimum_salary,
        maximum_salary: data.maximum_salary,
        currency: data.currency,
        description: data.description,
        responsibilities: data.responsibilities,
        qualifications: data.qualifications,
        benefits: data.benefits,
        company_id: data.company_id,
        status: data.status || job_status.OPEN,
      },
    });
  }

  async updateStatus(id: string, company_id: string, status: job_status) {
    return prisma.job.update({
      where: { id, company_id },
      data: { status },
    });
  }

  async update(id: string, company_id: string, data: Prisma.jobUpdateInput) {
    return prisma.job.update({
      where: { id, company_id },
      data,
    });
  }

  async findTopJobs(limit: number = 8) {
    return prisma.job.findMany({
      where: { status: job_status.OPEN },
      take: limit,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        department: true,
        location: true,
        location_type: true,
        employment_type: true,
        minimum_salary: true,
        maximum_salary: true,
        currency: true,
        status: true,
        created_at: true,
        company_id: true,
      },
    });
  }
}

export const jobRepository = new JobRepository();
export default jobRepository;
