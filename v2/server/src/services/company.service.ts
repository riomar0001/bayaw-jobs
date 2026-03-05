import { companyRepository } from '@/repositories/company.repository';
import { userRepository } from '@/repositories/user.repository';
import { AuthorizationError, ConflictError, NotFoundError } from '@/utils/errors.util';
import { AddAdminInput, BusinessOnboardingInput } from '@/validations/company.validation';
import { storageService } from '@/services/storage.service';
import logger from '@/configs/logger.config';

interface LogoFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export class CompanyService {
  async getTopCompanies() {
    const companies = await companyRepository.findTopCompanies(6);
    return companies.map(({ _count, ...company }) => ({
      ...company,
      open_jobs_count: _count.jobs,
    }));
  }

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

  async updateLogo(userId: string, file: LogoFile) {
    const company = await companyRepository.findByUserId(userId);
    if (!company) {
      throw new NotFoundError('Company');
    }

    const fileName = await storageService.uploadCompanyLogo(file.buffer, userId, file.originalname);
    await companyRepository.updateLogo(company.id, fileName);

    return {
      logo: fileName,
      url: `${process.env.APP_URL}/api/business/logo/${company.id}`,
    };
  }

  async getAdmins(requesterId: string, companyId: string) {
    const admins = await companyRepository.findAllAdminsByCompany(companyId);
    const myRecord = admins.find((a) => a.user_id === requesterId) ?? null;
    return { admins, my_rights: myRecord };
  }

  async addAdmin(requesterId: string, companyId: string, data: AddAdminInput) {
    const requester = await companyRepository.findAdminByUserAndCompany(requesterId, companyId);
    if (
      !requester ||
      !requester.can_create ||
      !requester.can_read ||
      !requester.can_update ||
      !requester.can_delete
    ) {
      throw new AuthorizationError('Only admins with full rights can add new admins');
    }

    const targetUser = await userRepository.findById(data.user_id);
    if (!targetUser) {
      throw new NotFoundError('User not found');
    }

    const existing = await companyRepository.findAdminByUserAndCompany(data.user_id, companyId);
    if (existing) {
      throw new ConflictError('User is already an admin of this company');
    }

    return companyRepository.addAdmin({
      company_id: companyId,
      user_id: data.user_id,
      role: data.role,
      ...(data.position !== undefined ? { position: data.position } : {}),
      can_create: data.can_create,
      can_read: data.can_read,
      can_update: data.can_update,
      can_delete: data.can_delete,
    });
  }

  async removeAdmin(requesterId: string, companyId: string, adminId: string) {
    const requester = await companyRepository.findAdminByUserAndCompany(requesterId, companyId);
    if (
      !requester ||
      !requester.can_create ||
      !requester.can_read ||
      !requester.can_update ||
      !requester.can_delete
    ) {
      throw new AuthorizationError('Only admins with full rights can remove admins');
    }

    const target = await companyRepository.findAdminById(adminId);
    if (!target || target.company_id !== companyId) {
      throw new NotFoundError('Admin not found');
    }

    if (target.user_id === requesterId) {
      throw new AuthorizationError('You cannot remove yourself as an admin');
    }

    return companyRepository.removeAdmin(adminId);
  }

  async getDashboard(companyId: string) {
    return companyRepository.getCompanyDashboard(companyId);
  }

  async getJobPostingStats(companyId: string) {
    return companyRepository.getJobPostingStats(companyId);
  }

  async getApplicantStats(companyId: string) {
    return companyRepository.getApplicantStats(companyId);
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
