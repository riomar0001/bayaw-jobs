import { applicantRepository } from '@/repositories/applicant.repository';
import { userRepository } from '@/repositories/user.repository';
import { ConflictError, NotFoundError, BadRequestError } from '@/utils/errors.util';
import { OnboardingInput } from '@/validations/applicant.validation';
import { storageService } from '@/services/storage.service';

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
      console.warn('Could not upload default profile picture:', err);
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
      console.warn('Could not upload resume during onboarding:', err);
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
    const resume_url = applicantResumes.length > 0
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

  async getProfilePicture(profileId: string): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
    const profile = await applicantRepository.findProfileById(profileId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    if (!profile.profile_picture) {
      throw new NotFoundError('Profile picture');
    }

    const { buffer, contentType } = await storageService.downloadProfilePicture(profile.profile_picture);
    return { buffer, contentType, filename: profile.profile_picture };
  }

  async updateProfilePicture(userId: string, file: ResumeFile & { originalname: string }) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }

    const fileName = await storageService.uploadProfilePicture(file.buffer, userId, file.originalname);
    await applicantRepository.updateProfilePicture(profile.id, fileName);

    return {
      profile_picture: fileName,
      url: `${process.env.APP_URL}/api/applicants/profile/picture/${profile.id}`,
    };
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
