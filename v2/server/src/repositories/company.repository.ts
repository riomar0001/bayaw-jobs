import prisma from '@/configs/prisma.config';

const COMPANY_INCLUDE = {
  companyContacts: true,
  companySocialLinks: true,
  companyLocations: true,
  companyAdmins: true,
} as const;

export interface CreateCompanyData {
  user_id: string;
  company_name: string;
  industry: string;
  about: string;
  company_size: string;
  foundation_year: number;
  website: string;
  logo: string | null;
  owner_position: string;
  contact: { email: string; phone: string };
  social_links?: { platform: 'FACEBOOK' | 'TWITTER' | 'LINKEDIN' | 'INSTAGRAM'; url: string }[];
  locations?: {
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  }[];
}

export class CompanyRepository {
  async findByUserId(userId: string) {
    return prisma.company_information.findFirst({
      where: { user_id: userId },
      include: COMPANY_INCLUDE,
    });
  }

  async findCompanyIdByAdminUserId(userId: string) {
    return prisma.company_admin.findFirst({
      where: { user_id: userId },
      select: { company_id: true },
    });
  }

  async findById(id: string) {
    return prisma.company_information.findUnique({
      where: { id },
      include: COMPANY_INCLUDE,
    });
  }

  async updateLogo(id: string, logo: string) {
    return prisma.company_information.update({
      where: { id },
      data: { logo },
    });
  }

  async findAllAdminsByCompany(companyId: string) {
    return prisma.company_admin.findMany({
      where: { company_id: companyId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: { created_at: 'asc' },
    });
  }

  async findAdminByUserAndCompany(userId: string, companyId: string) {
    return prisma.company_admin.findFirst({
      where: { user_id: userId, company_id: companyId },
    });
  }

  async findAdminById(adminId: string) {
    return prisma.company_admin.findUnique({
      where: { id: adminId },
    });
  }

  async addAdmin(data: {
    company_id: string;
    user_id: string;
    role: string;
    position?: string;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
  }) {
    return prisma.company_admin.create({ data });
  }

  async removeAdmin(adminId: string) {
    return prisma.company_admin.delete({ where: { id: adminId } });
  }

  async findTopCompanies(limit: number = 6) {
    return prisma.company_information.findMany({
      take: limit,
      orderBy: {
        jobs: { _count: 'desc' },
      },
      select: {
        id: true,
        company_name: true,
        industry: true,
        company_size: true,
        logo: true,
        website: true,
        _count: { select: { jobs: { where: { status: 'OPEN' } } } },
      },
    });
  }

  async createCompany(data: CreateCompanyData) {
    return prisma.company_information.create({
      data: {
        user_id: data.user_id,
        company_name: data.company_name,
        industry: data.industry,
        about: data.about,
        company_size: data.company_size,
        foundation_year: data.foundation_year,
        website: data.website,
        logo: data.logo,
        companyContacts: {
          create: {
            email: data.contact.email,
            phone: data.contact.phone,
          },
        },
        ...(data.social_links && data.social_links.length > 0
          ? { companySocialLinks: { create: data.social_links } }
          : {}),
        ...(data.locations && data.locations.length > 0
          ? { companyLocations: { create: data.locations } }
          : {}),
        companyAdmins: {
          create: {
            user_id: data.user_id,
            role: 'OWNER',
            position: data.owner_position,
            can_create: true,
            can_read: true,
            can_update: true,
            can_delete: true,
          },
        },
      },
      include: COMPANY_INCLUDE,
    });
  }
}

export const companyRepository = new CompanyRepository();
export default companyRepository;
