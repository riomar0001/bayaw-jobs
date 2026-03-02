export interface CreateJobData {
  title: string;
  department: string;
  location: string;
  location_type: string;
  employment_type: string;
  minimum_salary: string;
  maximum_salary: string;
  currency: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  status?: string;
}
