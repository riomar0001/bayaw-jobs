import { z } from 'zod';

const jobBodyFields = {
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  location_type: z.enum(['ONSITE', 'REMOTE', 'HYBRID'], {
    error: 'location_type must be one of: ONSITE, REMOTE, HYBRID',
  }),
  employment_type: z.string().min(1, 'Employment type is required'),
  minimum_salary: z.string().min(1, 'Minimum salary is required'),
  maximum_salary: z.string().min(1, 'Maximum salary is required'),
  currency: z.string().min(1, 'Currency is required'),
  description: z.string().min(1, 'Description is required'),
  responsibilities: z
    .array(z.string().min(1, 'Responsibility is required'))
    .min(1, 'At least one responsibility is required'),
  qualifications: z
    .array(z.string().min(1, 'Qualification is required'))
    .min(1, 'At least one qualification is required'),
  benefits: z
    .array(z.string().min(1, 'Benefit is required'))
    .min(1, 'At least one benefit is required'),
  company_id: z.uuid('company_id must be a valid UUID'),
};

export const getAllJobsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .refine((val) => val === undefined || /^\d+$/.test(val), {
        message: 'page must be a positive integer',
      }),
    limit: z
      .string()
      .optional()
      .refine((val) => val === undefined || /^\d+$/.test(val), {
        message: 'limit must be a positive integer',
      }),
  }),
});

export const getJobByIdSchema = z.object({
  params: z.object({
    id: z.uuid('Job ID must be a valid UUID'),
  }),
});

export const createJobSchema = z.object({
  body: z.object(jobBodyFields),
});

export const updateJobSchema = z.object({
  params: z.object({
    id: z.uuid('Job ID must be a valid UUID'),
  }),
  body: z
    .object({
      title: jobBodyFields.title.optional(),
      department: jobBodyFields.department.optional(),
      location: jobBodyFields.location.optional(),
      location_type: jobBodyFields.location_type.optional(),
      employment_type: jobBodyFields.employment_type.optional(),
      minimum_salary: jobBodyFields.minimum_salary.optional(),
      maximum_salary: jobBodyFields.maximum_salary.optional(),
      currency: jobBodyFields.currency.optional(),
      description: jobBodyFields.description.optional(),
      responsibilities: jobBodyFields.responsibilities.optional(),
      qualifications: jobBodyFields.qualifications.optional(),
      benefits: jobBodyFields.benefits.optional(),
      company_id: jobBodyFields.company_id.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export type CreateJobInput = z.infer<typeof createJobSchema>['body'];
export type UpdateJobInput = z.infer<typeof updateJobSchema>['body'];
