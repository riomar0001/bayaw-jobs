import prisma from '@/configs/prisma.config';
import { Prisma, location_type } from '@/generated/prisma/client';

export interface CreateJobData {
  title: string;
  department: string;
  location: string;
  location_type: location_type;
  employment_type: string;
  minimum_salary: string;
  maximum_salary: string;
  currency: string;
  description: string;
  responsibilities: string;
  qualifications: string;
  benefits: string;
  company_id: string;
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

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.job.count(),
    ]);

    return {
      data: jobs,
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
      },
    });
  }

  async update(id: string, data: Prisma.jobUpdateInput) {
    return prisma.job.update({
      where: { id },
      data,
    });
  }
}

export const jobRepository = new JobRepository();
export default jobRepository;
