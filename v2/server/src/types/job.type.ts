import { location_type, employment_type, job_status } from '@/generated/prisma/client';

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
  status?: job_status;
}
