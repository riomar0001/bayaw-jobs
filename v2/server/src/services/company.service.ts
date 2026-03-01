import { companyRepository } from '@/repositories/company.repository';
import { userRepository } from '@/repositories/user.repository';
import { ConflictError, NotFoundError } from '@/utils/errors.util';
import { BusinessOnboardingInput } from '@/validations/company.validation';
import { storageService } from '@/services/storage.service';
import logger from '@/configs/logger.config';

interface LogoFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export class CompanyService {
  async onboard(userId: string, data: BusinessOnboardingInput, logoFile?: LogoFile) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    const existingCompany = await companyRepository.findByUserId(userId);
    if (existingCompany) {
      throw new ConflictError('Company profile already exists');
    }

    let logo: string | null = null;
    if (logoFile) {
      try {
        logo = await storageService.uploadCompanyLogo(
          logoFile.buffer,
          userId,
          logoFile.originalname
        );
      } catch (err) {
        logger.warn('Could not upload company logo during onboarding', { error: err });
      }
    }

    const company = await companyRepository.createCompany({
      user_id: userId,
      company_name: data.company_name,
      industry: data.industry,
      about: data.about,
      company_size: data.company_size,
      foundation_year: data.foundation_year,
      website: data.website,
      logo,
      owner_position: data.owner_position,
      contact: data.contact,
      ...(data.social_links !== undefined ? { social_links: data.social_links } : {}),
      ...(data.locations !== undefined ? { locations: data.locations } : {}),
    });

    // Update user role to COMPANY_OWNER
    await userRepository.update(userId, { role: 'COMPANY_OWNER' });

    const logo_url = company.logo
      ? `${process.env.APP_URL}/api/business/logo/${company.id}`
      : null;

    return { ...company, logo_url };
  }

  async getLogo(
    companyId: string
  ): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
    const company = await companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company');
    }

    if (!company.logo) {
      throw new NotFoundError('Company logo');
    }

    const { buffer, contentType } = await storageService.downloadCompanyLogo(company.logo);
    return { buffer, contentType, filename: company.logo };
  }
}

export const companyService = new CompanyService();
export default companyService;
