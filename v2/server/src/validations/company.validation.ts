import { z } from 'zod';

const contactSchema = z.object({
  email: z.string().email('Invalid contact email'),
  phone: z.string().min(1, 'Contact phone is required'),
});

const socialLinkSchema = z.object({
  platform: z.enum(['FACEBOOK', 'TWITTER', 'LINKEDIN', 'INSTAGRAM'], {
    error: 'Platform must be one of: FACEBOOK, TWITTER, LINKEDIN, INSTAGRAM',
  }),
  url: z.string().url('Invalid URL'),
});

const locationSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  is_headquarter: z
    .boolean({ error: '"is_headquarter" must be a boolean' })
    .optional()
    .default(false),
});

export const businessOnboardingSchema = z.object({
  body: z.object({
    company_name: z.string().min(1, 'Company name is required'),
    industry: z.string().min(1, 'Industry is required'),
    about: z.string().min(1, 'About company is required'),
    company_size: z.string().min(1, 'Company size is required'),
    foundation_year: z
      .number({ error: 'Foundation year must be a number' })
      .int()
      .min(1800, 'Foundation year must be at least 1800')
      .max(new Date().getFullYear(), 'Foundation year cannot be in the future'),
    website: z.string().url('Invalid website URL'),
    owner_position: z.string().min(1, 'Owner position is required'),
    contact: contactSchema,
    social_links: z.array(socialLinkSchema).optional(),
    locations: z.array(locationSchema).optional(),
  }),
});

export type BusinessOnboardingInput = z.infer<typeof businessOnboardingSchema>['body'];

export const getAllCompaniesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(10),
    industry: z.string().optional(),
    company_size: z.string().optional(),
    search: z.string().optional(),
  }),
});

export type GetAllCompaniesQuery = z.infer<typeof getAllCompaniesSchema>['query'];

export const updateCompanyInfoSchema = z.object({
  body: z
    .object({
      company_name: z.string().min(1, 'Company name is required').optional(),
      industry: z.string().min(1, 'Industry is required').optional(),
      about: z.string().min(1, 'About is required').optional(),
      company_size: z.string().min(1, 'Company size is required').optional(),
      foundation_year: z
        .number({ error: 'Foundation year must be a number' })
        .int()
        .min(1800, 'Foundation year must be at least 1800')
        .max(new Date().getFullYear(), 'Foundation year cannot be in the future')
        .optional(),
      website: z.string().url('Invalid website URL').optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});

export const updateSocialLinksSchema = z.object({
  body: z.object({
    facebook: z.string().url('Invalid URL').nullable().optional(),
    linkedin: z.string().url('Invalid URL').nullable().optional(),
    twitter: z.string().url('Invalid URL').nullable().optional(),
    instagram: z.string().url('Invalid URL').nullable().optional(),
  }),
});

export const updateContactSchema = z.object({
  body: z
    .object({
      email: z.string().email('Invalid email').optional(),
      phone: z.string().min(1, 'Phone is required').optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});

export const addLocationSchema = z.object({
  body: locationSchema,
});

export const updateLocationSchema = z.object({
  params: z.object({ id: z.string().uuid('Location ID must be a valid UUID') }),
  body: z.object({
    address: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
    postal_code: z.string().min(1).optional(),
    is_headquarter: z.boolean().optional(),
  }),
});

export const deleteLocationSchema = z.object({
  params: z.object({ id: z.string().uuid('Location ID must be a valid UUID') }),
});

export type UpdateCompanyInfoInput = z.infer<typeof updateCompanyInfoSchema>['body'];
export type UpdateSocialLinksInput = z.infer<typeof updateSocialLinksSchema>['body'];
export type UpdateContactInput = z.infer<typeof updateContactSchema>['body'];
export type AddLocationInput = z.infer<typeof addLocationSchema>['body'];
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>['body'];

export const addAdminSchema = z.object({
  body: z.object({
    email: z.string().email('Must be a valid email address'),
    role: z.string().min(1, 'Role is required'),
    position: z.string().optional(),
    can_create: z.boolean({ error: '"can_create" must be a boolean' }).default(false),
    can_read: z.boolean({ error: '"can_read" must be a boolean' }).default(true),
    can_update: z.boolean({ error: '"can_update" must be a boolean' }).default(false),
    can_delete: z.boolean({ error: '"can_delete" must be a boolean' }).default(false),
  }),
});

export const deleteAdminSchema = z.object({
  params: z.object({
    id: z.string().uuid('Admin ID must be a valid UUID'),
  }),
});

export const updateApplicationStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Application ID must be a valid UUID'),
  }),
  body: z.object({
    status: z.enum(['NEW', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED', 'CANCELLED'], {
      error: 'Invalid application status',
    }),
  }),
});

export type AddAdminInput = z.infer<typeof addAdminSchema>['body'];
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>['body'];
