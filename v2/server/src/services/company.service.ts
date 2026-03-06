import { companyRepository } from '@/repositories/company.repository';
import { userRepository } from '@/repositories/user.repository';
import { AuthorizationError, ConflictError, NotFoundError } from '@/utils/errors.util';
import {
  AddAdminInput,
  AddLocationInput,
  BusinessOnboardingInput,
  UpdateCompanyInfoInput,
  UpdateContactInput,
  UpdateLocationInput,
  UpdateSocialLinksInput,
} from '@/validations/company.validation';
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

  async getAllCompanies(query: { page: number; limit: number; industry?: string; company_size?: string; search?: string }) {
    const result = await companyRepository.findAllCompanies(query);
    return {
      ...result,
      companies: result.companies.map(({ logo, ...company }) => ({
        ...company,
        logo_url: logo ? `${process.env.APP_URL}/api/business/logo/${company.id}` : null,
      })),
    };
  }

  async getPublicCompanyInfo(companyId: string) {
    const company = await companyRepository.findPublicById(companyId);
    if (!company) throw new NotFoundError('Company');

    const { _count, logo, ...rest } = company;
    return {
      ...rest,
      logo_url: logo ? `${process.env.APP_URL}/api/business/logo/${companyId}` : null,
      open_positions: _count.jobs,
    };
  }

  async getCompanyInfo(companyId: string) {
    const company = await companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company');
    }

    const { companyContacts, companySocialLinks, companyLocations, companyAdmins: _companyAdmins, logo, ...info } = company;

    const PLATFORM_MAP: Record<string, string | null> = {
      FACEBOOK: null, LINKEDIN: null, TWITTER: null, INSTAGRAM: null,
    };
    for (const link of companySocialLinks) {
      PLATFORM_MAP[link.platform] = link.url;
    }

    const contact = companyContacts[0] ?? null;
    const logo_url = logo ? `${process.env.APP_URL}/api/business/logo/${companyId}` : null;

    return {
      ...info,
      logo_url,
      contact: contact ? { email: contact.email, phone: contact.phone } : null,
      social_links: {
        facebook: PLATFORM_MAP['FACEBOOK'],
        linkedin: PLATFORM_MAP['LINKEDIN'],
        twitter: PLATFORM_MAP['TWITTER'],
        instagram: PLATFORM_MAP['INSTAGRAM'],
      },
      locations: companyLocations,
    };
  }

  async updateCompanyInfo(companyId: string, data: UpdateCompanyInfoInput) {
    const company = await companyRepository.findById(companyId);
    if (!company) throw new NotFoundError('Company');
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    ) as Parameters<typeof companyRepository.updateCompanyInfo>[1];
    return companyRepository.updateCompanyInfo(companyId, clean);
  }

  async updateSocialLinks(companyId: string, data: UpdateSocialLinksInput) {
    const company = await companyRepository.findById(companyId);
    if (!company) throw new NotFoundError('Company');

    const PLATFORM_KEY_MAP = {
      facebook: 'FACEBOOK',
      linkedin: 'LINKEDIN',
      twitter: 'TWITTER',
      instagram: 'INSTAGRAM',
    } as const;

    const links = (Object.entries(data) as [keyof typeof PLATFORM_KEY_MAP, string | null | undefined][])
      .filter(([, url]) => url !== undefined)
      .map(([key, url]) => ({ platform: PLATFORM_KEY_MAP[key], url: url ?? null }));

    return companyRepository.upsertSocialLinks(companyId, links);
  }

  async updateContact(companyId: string, data: UpdateContactInput) {
    const company = await companyRepository.findById(companyId);
    if (!company) throw new NotFoundError('Company');
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    ) as Parameters<typeof companyRepository.updateContact>[1];
    return companyRepository.updateContact(companyId, clean);
  }

  async addLocation(companyId: string, data: AddLocationInput) {
    const company = await companyRepository.findById(companyId);
    if (!company) throw new NotFoundError('Company');
    return companyRepository.addLocation(companyId, data);
  }

  async updateLocation(companyId: string, locationId: string, data: UpdateLocationInput) {
    const company = await companyRepository.findById(companyId);
    if (!company) throw new NotFoundError('Company');
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    ) as Parameters<typeof companyRepository.updateLocation>[2];
    const location = await companyRepository.updateLocation(locationId, companyId, clean);
    if (!location) throw new NotFoundError('Location');
    return location;
  }

  async deleteLocation(companyId: string, locationId: string) {
    const company = await companyRepository.findById(companyId);
    if (!company) throw new NotFoundError('Company');
    const deleted = await companyRepository.deleteLocation(locationId, companyId);
    if (!deleted) throw new NotFoundError('Location');
    return deleted;
  }

  async getApplicantInfo(applicationId: string, companyId: string) {
    const data = await companyRepository.findApplicantInfoByApplicationId(applicationId, companyId);
    if (!data) {
      throw new NotFoundError('Application not found');
    }

    const { applicant_profile, ...applicationMeta } = data.application;
    const { applicantResumes, profile_picture, ...profileRest } = applicant_profile;

    const resume_url =
      applicantResumes.length > 0
        ? `${process.env.APP_URL}/api/applicants/resume/${applicant_profile.id}`
        : null;

    const profile_picture_url = profile_picture
      ? `${process.env.APP_URL}/api/applicants/profile/picture/${applicant_profile.id}`
      : null;

    return {
      application: applicationMeta,
      applicant: { ...profileRest, profile_picture_url, resume_url },
      other_applications: data.other_applications,
    };
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
