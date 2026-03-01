import { applicantRepository } from '@/repositories/applicant.repository';
import { userRepository } from '@/repositories/user.repository';
import { ConflictError, NotFoundError, BadRequestError } from '@/utils/errors.util';
import { OnboardingInput } from '@/validations/applicant.validation';

export class ApplicantService {
  async onboard(userId: string, data: OnboardingInput) {
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

    const emailTaken = await applicantRepository.findProfileByEmail(data.profile.email);
    if (emailTaken) {
      throw new ConflictError('This email is already associated with another applicant profile');
    }

    const profile = await applicantRepository.createProfile({
      user_id: userId,
      ...data.profile,
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

    await userRepository.update(userId, {
      first_name: data.profile.first_name,
      last_name: data.profile.last_name,
      done_onboarding: true,
    });

    return profile;
  }

  async getProfile(userId: string) {
    const profile = await applicantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Applicant profile');
    }
    return profile;
  }
}

export const applicantService = new ApplicantService();
export default applicantService;
