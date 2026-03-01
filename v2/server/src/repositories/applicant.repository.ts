import prisma from '@/configs/prisma.config';
import {
  ApplicantProfile,
  ApplicantEducation,
  ApplicantExperience,
  ApplicantSkills,
  ApplicantLanguages,
} from '@/types/applicants.type';

export interface CreateApplicantProfileData extends ApplicantProfile {
  education: ApplicantEducation[];
  experience: ApplicantExperience[];
  skills: ApplicantSkills[];
  languages: ApplicantLanguages[];
}

const OMIT_TIMESTAMPS = { created_at: true, updated_at: true } as const;

const PROFILE_INCLUDE = {
  applicantSkills: { omit: OMIT_TIMESTAMPS },
  applicantExperiences: { omit: OMIT_TIMESTAMPS },
  applicantEducations: { omit: OMIT_TIMESTAMPS },
  applicantLanguages: { omit: OMIT_TIMESTAMPS },
  applicantResumes: { omit: OMIT_TIMESTAMPS },
  applicantCareerStatuses: { omit: OMIT_TIMESTAMPS },
} as const;

export class ApplicantRepository {
  async findProfileById(id: string) {
    return prisma.applicant_profile.findUnique({
      where: { id },
      include: PROFILE_INCLUDE,
    });
  }

  async findProfileByUserId(user_id: string) {
    return prisma.applicant_profile.findFirst({
      where: { user_id },
      include: PROFILE_INCLUDE,
    });
  }

  async findProfileByEmail(email: string) {
    return prisma.applicant_profile.findUnique({
      where: { email },
    });
  }

  async updateProfilePicture(profileId: string, filename: string) {
    return prisma.applicant_profile.update({
      where: { id: profileId },
      data: { profile_picture: filename },
    });
  }

  async upsertResume(applicantProfileId: string, fileName: string) {
    await prisma.applicant_resume.deleteMany({ where: { applicant_profile_id: applicantProfileId } });
    return prisma.applicant_resume.create({
      data: {
        applicant_profile_id: applicantProfileId,
        file_name: fileName,
      },
    });
  }

  async createProfile(data: CreateApplicantProfileData) {
    return prisma.applicant_profile.create({
      data: {
        user_id: data.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        age: data.age,
        gender: data.gender,
        desired_position: data.desired_position,
        profile_picture: data.profile_picture ?? null,
        applicantEducations: {
          create: data.education.map((edu) => ({
            institution_name: edu.institution_name,
            field_of_study: edu.field_of_study,
            start_year: edu.start_year,
            end_year: edu.end_year ?? null,
          })),
        },
        applicantExperiences: {
          create: data.experience.map((exp) => ({
            company_name: exp.company_name,
            position: exp.position,
            start_date: new Date(exp.start_date),
            is_current: exp.is_current,
            end_date: exp.end_date ? new Date(exp.end_date) : null,
          })),
        },
        applicantSkills: {
          create: data.skills.map((skill) => ({
            skill_name: skill.skill_name,
          })),
        },
        applicantLanguages: {
          create: data.languages.map((lang) => ({
            language_name: lang.language_name,
            proficiency_level: lang.proficiency_level,
          })),
        },
        applicantCareerStatuses: {
          create: { status: data.career_status ?? 'ACTIVELY_LOOKING' },
        },
      },
      include: PROFILE_INCLUDE,
    });
  }
}

export const applicantRepository = new ApplicantRepository();
export default applicantRepository;
