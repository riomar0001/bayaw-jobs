import { applicantRepository } from '@/repositories/applicant.repository';
import { userRepository } from '@/repositories/user.repository';
import { ConflictError, NotFoundError, BadRequestError } from '@/utils/errors.util';
import {
  OnboardingInput,
  UpdateProfileInput,
  UpdateEducationInput,
  AddEducationInput,
  AddExperienceInput,
  UpdateExperienceInput,
  UpdateCareerStatusInput,
  AddLanguageInput,
  UpdateLanguageInput,
} from '@/validations/applicant.validation';
import { storageService } from '@/services/storage.service';
import logger from '@/configs/logger.config';

interface ResumeFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

export class ApplicantService {
  async onboard(userId: string, data: OnboardingInput, resumeFile: ResumeFile) {
    if (!resumeFile) {
      throw new BadRequestError('Resume is required');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    if (user.done_onboarding) {
      throw new BadRequestError('Onboarding has already been completed');
    }

    const existingProfile = await applicantRepository.findProfileByUserId(userId);
    if (existingProfile) {
      throw new ConflictError('Applicant profile already exists');
    }

    // Upload default profile picture to the profile-picture bucket
    let profilePicture: string | null = null;
    try {
      profilePicture = await storageService.uploadDefaultProfilePicture(userId);
    } catch (err) {
      logger.warn('Could not upload default profile picture', { error: err });
    }

    const profile = await applicantRepository.createProfile({
      user_id: userId,
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      email: user.email,
      ...data.profile,
      profile_picture: profilePicture,
      education: (data.education || []).map((edu) => ({
        ...edu,
        end_year: edu.end_year ?? null,
      })),
      experience: (data.experience || []).map((exp) => ({
        ...exp,
        end_date: 'end_date' in exp ? (exp.end_date ?? null) : null,
      })),
      skills: data.skills || [],
      languages: data.languages || [],
    });

    await userRepository.update(userId, { done_onboarding: true });

    // Upload resume during onboarding
    let resumeUrl: string | null = null;
    try {
      const fileName = await storageService.uploadResume(resumeFile.buffer, userId);
      const resume = await applicantRepository.upsertResume(profile.id, fileName);
      profile.applicantResumes = [resume];
      resumeUrl = `${process.env.APP_URL}/api/applicants/resume/${profile.id}`;
    } catch (err) {
      logger.warn('Could not upload resume during onboarding', { error: err });
    }

    const { applicantCareerStatuses, ...profileRest } = profile;
    const career_status = applicantCareerStatuses[0]?.status ?? null;

    return { ...profileRest, career_status, resume_url: resumeUrl };
  }

  async getProfile(userId: string) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    const { applicantResumes, applicantCareerStatuses, ...rest } = profile;
    const resume_url =
      applicantResumes.length > 0
        ? `${process.env.APP_URL}/api/applicants/resume/${profile.id}`
        : null;
    const profile_picture_url = profile.profile_picture
      ? `${process.env.APP_URL}/api/applicants/profile/picture/${profile.id}`
      : null;
    const career_status = applicantCareerStatuses[0]?.status ?? null;

    return { ...rest, career_status, resume_url, profile_picture_url };
  }

  async getResume(profileId: string): Promise<{ buffer: Buffer; filename: string }> {
    const profile = await applicantRepository.findProfileById(profileId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    const resume = profile.applicantResumes[0];
    if (!resume) {
      throw new NotFoundError('Resume');
    }

    const buffer = await storageService.downloadResume(resume.file_name);
    return { buffer, filename: resume.file_name };
  }

  async getProfilePicture(
    profileId: string
  ): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
    const profile = await applicantRepository.findProfileById(profileId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    if (!profile.profile_picture) {
      throw new NotFoundError('Profile picture');
    }

    const { buffer, contentType } = await storageService.downloadProfilePicture(
      profile.profile_picture
    );
    return { buffer, contentType, filename: profile.profile_picture };
  }

  async updateProfilePicture(userId: string, file: ResumeFile & { originalname: string }) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    const fileName = await storageService.uploadProfilePicture(
      file.buffer,
      userId,
      file.originalname
    );
    await applicantRepository.updateProfilePicture(profile.id, fileName);

    return {
      profile_picture: fileName,
      url: `${process.env.APP_URL}/api/applicants/profile/picture/${profile.id}`,
    };
  }

  async getEducations(userId: string) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }
    return profile.applicantEducations;
  }

  async getExperiences(userId: string) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }
    return profile.applicantExperiences;
  }

  async getCareerStatus(userId: string) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }
    return { career_status: profile.applicantCareerStatuses[0]?.status ?? null };
  }

  async updateCareerStatus(userId: string, data: UpdateCareerStatusInput) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }
    return applicantRepository.updateCareerStatus(profile.id, data.career_status);
  }

  async getLanguages(userId: string) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }
    return profile.applicantLanguages;
  }

  async addLanguage(userId: string, data: AddLanguageInput) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }
    return applicantRepository.addLanguage(profile.id, data);
  }

  async updateLanguage(userId: string, languageId: string, data: UpdateLanguageInput) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    const language = profile.applicantLanguages.find((l) => l.id === languageId);
    if (!language) {
      throw new NotFoundError('Language entry');
    }

    const patch: Parameters<typeof applicantRepository.updateLanguage>[1] = {};
    if (data.language_name !== undefined) patch.language_name = data.language_name;
    if (data.proficiency_level !== undefined) patch.proficiency_level = data.proficiency_level;

    return applicantRepository.updateLanguage(languageId, patch);
  }

  async deleteLanguage(userId: string, languageId: string) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    const language = profile.applicantLanguages.find((l) => l.id === languageId);
    if (!language) {
      throw new NotFoundError('Language entry');
    }

    return applicantRepository.deleteLanguage(languageId);
  }

  async addExperience(userId: string, data: AddExperienceInput) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    return applicantRepository.addExperience(profile.id, {
      company_name: data.company_name,
      position: data.position,
      start_date: new Date(data.start_date),
      is_current: data.is_current,
      end_date: data.end_date ? new Date(data.end_date) : null,
    });
  }

  async updateExperience(userId: string, experienceId: string, data: UpdateExperienceInput) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    const experience = profile.applicantExperiences.find((e) => e.id === experienceId);
    if (!experience) {
      throw new NotFoundError('Experience entry');
    }

    const patch: Parameters<typeof applicantRepository.updateExperience>[1] = {};
    if (data.company_name !== undefined) patch.company_name = data.company_name;
    if (data.position !== undefined) patch.position = data.position;
    if (data.start_date !== undefined) patch.start_date = new Date(data.start_date);
    if (data.is_current !== undefined) patch.is_current = data.is_current;
    if ('end_date' in data) patch.end_date = data.end_date ? new Date(data.end_date) : null;

    return applicantRepository.updateExperience(experienceId, patch);
  }

  async deleteExperience(userId: string, experienceId: string) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    const experience = profile.applicantExperiences.find((e) => e.id === experienceId);
    if (!experience) {
      throw new NotFoundError('Experience entry');
    }

    return applicantRepository.deleteExperience(experienceId);
  }

  async deleteEducation(userId: string, educationId: string) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    const education = profile.applicantEducations.find((e) => e.id === educationId);
    if (!education) {
      throw new NotFoundError('Education entry');
    }

    return applicantRepository.deleteEducation(educationId);
  }

  async addEducation(userId: string, data: AddEducationInput) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    return applicantRepository.addEducation(profile.id, {
      institution_name: data.institution_name,
      field_of_study: data.field_of_study,
      start_year: data.start_year,
      end_year: data.end_year ?? null,
    });
  }

  async updateEducation(userId: string, educationId: string, data: UpdateEducationInput) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    const education = profile.applicantEducations.find((e) => e.id === educationId);
    if (!education) {
      throw new NotFoundError('Education entry');
    }

    const patch = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    ) as Parameters<typeof applicantRepository.updateEducation>[1];

    return applicantRepository.updateEducation(educationId, patch);
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    const patch = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    ) as Parameters<typeof applicantRepository.updateProfile>[1];

    const updated = await applicantRepository.updateProfile(profile.id, patch);

    return updated;
  }

  async uploadResume(userId: string, file: ResumeFile) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    // File stored as resume_<userId>.pdf in the resume bucket
    const fileName = await storageService.uploadResume(file.buffer, userId);
    const resume = await applicantRepository.upsertResume(profile.id, fileName);

    return {
      ...resume,
      url: `${process.env.APP_URL}/api/applicants/resume/${profile.id}`,
    };
  }
}

export const applicantService = new ApplicantService();
export default applicantService;
