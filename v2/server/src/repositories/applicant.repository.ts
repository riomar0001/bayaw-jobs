import prisma from '@/configs/prisma.config';
import { application_status } from '@/generated/prisma/enums';
import {
  ApplicantProfile,
  ApplicantEducation,
  ApplicantExperience,
  ApplicantSkills,
  ApplicantLanguages,
  ApplicantCareerStatus,
  LanguageProficiency,
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

  async findProfileIdByUserId(user_id: string) {
    return prisma.applicant_profile.findFirst({
      where: { user_id },
      select: { id: true },
    });
  }

  async findEducationById(id: string) {
    return prisma.applicant_education.findUnique({
      where: { id },
    });
  }

  async updateCareerStatus(profileId: string, status: ApplicantCareerStatus) {
    await prisma.applicant_career_status.updateMany({
      where: { applicant_profile_id: profileId },
      data: { status },
    });
    return { career_status: status };
  }

  async addLanguage(
    profileId: string,
    data: { language_name: string; proficiency_level: LanguageProficiency }
  ) {
    return prisma.applicant_language.create({
      data: {
        applicant_profile_id: profileId,
        language_name: data.language_name,
        proficiency_level: data.proficiency_level,
      },
    });
  }

  async updateLanguage(
    id: string,
    data: Partial<{ language_name: string; proficiency_level: LanguageProficiency }>
  ) {
    return prisma.applicant_language.update({
      where: { id },
      data,
    });
  }

  async deleteLanguage(id: string) {
    return prisma.applicant_language.delete({
      where: { id },
    });
  }

  async addExperience(
    profileId: string,
    data: {
      company_name: string;
      position: string;
      start_date: Date;
      is_current: boolean;
      end_date?: Date | null;
    }
  ) {
    return prisma.applicant_experience.create({
      data: {
        applicant_profile_id: profileId,
        company_name: data.company_name,
        position: data.position,
        start_date: data.start_date,
        is_current: data.is_current,
        end_date: data.end_date ?? null,
      },
    });
  }

  async updateExperience(
    id: string,
    data: {
      company_name?: string;
      position?: string;
      start_date?: Date;
      is_current?: boolean;
      end_date?: Date | null;
    }
  ) {
    return prisma.applicant_experience.update({
      where: { id },
      data,
    });
  }

  async deleteExperience(id: string) {
    return prisma.applicant_experience.delete({
      where: { id },
    });
  }

  async deleteEducation(id: string) {
    return prisma.applicant_education.delete({
      where: { id },
    });
  }

  async addEducation(
    profileId: string,
    data: Pick<ApplicantEducation, 'institution_name' | 'field_of_study' | 'start_year'> & {
      end_year?: number | null;
    }
  ) {
    return prisma.applicant_education.create({
      data: {
        applicant_profile_id: profileId,
        institution_name: data.institution_name,
        field_of_study: data.field_of_study,
        start_year: data.start_year,
        end_year: data.end_year ?? null,
      },
    });
  }

  async updateEducation(
    id: string,
    data: Partial<
      Pick<ApplicantEducation, 'institution_name' | 'field_of_study' | 'start_year'>
    > & {
      end_year?: number | null;
    }
  ) {
    return prisma.applicant_education.update({
      where: { id },
      data,
    });
  }

  async updateProfile(
    profileId: string,
    data: Partial<Pick<ApplicantProfile, 'age' | 'location' | 'phone_number' | 'gender'>>
  ) {
    return prisma.applicant_profile.update({
      where: { id: profileId },
      data,
    });
  }

  async updateProfilePicture(profileId: string, filename: string) {
    return prisma.applicant_profile.update({
      where: { id: profileId },
      data: { profile_picture: filename },
    });
  }

  async upsertResume(applicantProfileId: string, fileName: string) {
    await prisma.applicant_resume.deleteMany({
      where: { applicant_profile_id: applicantProfileId },
    });
    return prisma.applicant_resume.create({
      data: {
        applicant_profile_id: applicantProfileId,
        file_name: fileName,
      },
    });
  }

  async findSkillsByProfileId(profileId: string) {
    return prisma.applicant_skill.findMany({
      where: { applicant_profile_id: profileId },
      select: { id: true, skill_name: true },
      orderBy: { created_at: 'asc' },
    });
  }

  async addSkills(profileId: string, skillNames: string[]) {
    await prisma.applicant_skill.createMany({
      data: skillNames.map((skill_name) => ({ applicant_profile_id: profileId, skill_name })),
    });
    return prisma.applicant_skill.findMany({
      where: { applicant_profile_id: profileId },
      select: { id: true, skill_name: true },
      orderBy: { created_at: 'asc' },
    });
  }

  async deleteSkill(skillId: string, profileId: string) {
    return prisma.applicant_skill.deleteMany({
      where: { id: skillId, applicant_profile_id: profileId },
    });
  }

  async findApplicationByProfileAndJob(profileId: string, jobId: string) {
    return prisma.applicant_applied_job.findFirst({
      where: { applicant_profile_id: profileId, jobId },
    });
  }

  async findActiveApplications(profileId: string, limit: number = 3) {
    return prisma.applicant_applied_job.findMany({
      where: {
        applicant_profile_id: profileId,
        status: { notIn: ['HIRED', 'REJECTED', 'CANCELLED'] as application_status[] },
      },
      take: limit,
      orderBy: { application_date: 'desc' },
      select: {
        id: true,
        status: true,
        application_date: true,
        job: {
          select: {
            id: true,
            title: true,
            department: true,
            location: true,
            employment_type: true,
            company_id: true,
          },
        },
      },
    });
  }

  async getApplicationStats(profileId: string) {
    const [grouped, total] = await Promise.all([
      prisma.applicant_applied_job.groupBy({
        by: ['status'],
        where: { applicant_profile_id: profileId },
        _count: { _all: true },
      }),
      prisma.applicant_applied_job.count({ where: { applicant_profile_id: profileId } }),
    ]);

    const ALL_STATUSES = [
      'NEW',
      'SCREENING',
      'INTERVIEW',
      'OFFER',
      'REJECTED',
      'HIRED',
      'CANCELLED',
    ] as const;
    const countsMap = Object.fromEntries(grouped.map((g) => [g.status, g._count._all]));
    const stats = ALL_STATUSES.reduce(
      (acc, s) => {
        acc[s] = countsMap[s] ?? 0;
        return acc;
      },
      {} as Record<string, number>
    );

    return { total, ...stats };
  }

  async findAllApplications(profileId: string, page: number = 1, limit: number = 4) {
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      prisma.applicant_applied_job.findMany({
        where: { applicant_profile_id: profileId },
        skip,
        take: limit,
        orderBy: { application_date: 'desc' },
        select: {
          id: true,
          status: true,
          application_date: true,
          job: {
            select: {
              id: true,
              title: true,
              department: true,
              location: true,
              employment_type: true,
              location_type: true,
              company_id: true,
            },
          },
        },
      }),
      prisma.applicant_applied_job.count({ where: { applicant_profile_id: profileId } }),
    ]);

    return {
      data: applications,
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

  async createApplication(profileId: string, jobId: string) {
    return prisma.applicant_applied_job.create({
      data: { applicant_profile_id: profileId, job_id: jobId, jobId },
      select: {
        id: true,
        status: true,
        application_date: true,
        job: { select: { id: true, title: true, department: true, company_id: true } },
      },
    });
  }

  async findAllApplicantsByCompany(companyId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      prisma.applicant_applied_job.findMany({
        where: { job: { company_id: companyId } },
        skip,
        take: limit,
        orderBy: { application_date: 'desc' },
        select: {
          id: true,
          status: true,
          application_date: true,
          applicant_profile: {
            select: {
              desired_position: true,
              profile_picture: true,
            },
          },
          job: {
            select: {
              title: true,
              department: true,
            },
          },
        },
      }),
      prisma.applicant_applied_job.count({
        where: { job: { company_id: companyId } },
      }),
    ]);

    return {
      data: applications,
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

  async createProfile(data: CreateApplicantProfileData) {
    return prisma.applicant_profile.create({
      data: {
        user_id: data.user_id,
        age: data.age,
        gender: data.gender,
        desired_position: data.desired_position,
        location: data.location,
        phone_number: data.phone_number,
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
