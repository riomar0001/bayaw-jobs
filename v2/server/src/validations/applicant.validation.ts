import { z } from 'zod';

const educationSchema = z.object({
  institution_name: z.string().min(1, 'Institution name is required'),
  field_of_study: z.string().min(1, 'Field of study is required'),
  start_year: z.number().int().min(1900).max(new Date().getFullYear()),
  end_year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 10)
    .nullable()
    .optional(),
});

const experienceSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  start_date: z.string().min(1, 'Start date is required'),
  is_current: z.boolean(),
  end_date: z.string().nullable().optional(),
});

const skillSchema = z.object({
  skill_name: z.string().min(1, 'Skill name is required'),
});

const languageSchema = z.object({
  language_name: z.string().min(1, 'Language name is required'),
  proficiency_level: z.enum(['BASIC', 'CONVERSATIONAL', 'FLUENT', 'NATIVE'], {
    error: 'Proficiency level must be one of: BASIC, CONVERSATIONAL, FLUENT, NATIVE',
  }),
});

const profileSchema = z.object({
  age: z.number().int().min(16, 'Must be at least 16 years old').max(100),
  gender: z.string().min(1, 'Gender is required'),
  desired_position: z.string().min(1, 'Desired position is required'),
  career_status: z
    .enum(['ACTIVELY_LOOKING', 'OPEN_TO_OPPORTUNITIES', 'EMPLOYED_NOT_LOOKING', 'NOT_LOOKING'], {
      error:
        'career_status must be one of: ACTIVELY_LOOKING, OPEN_TO_OPPORTUNITIES, EMPLOYED_NOT_LOOKING, NOT_LOOKING',
    })
    .optional(),
});

export const onboardingSchema = z.object({
  body: z.object({
    profile: profileSchema,
    education: z
      .array(educationSchema)
      .min(1, 'At least one education entry is required')
      .optional(),
    experience: z.array(experienceSchema).optional(),
    skills: z.array(skillSchema).min(1, 'At least one skill is required'),
    languages: z.array(languageSchema).min(1, 'At least one language is required'),
  }),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>['body'];
