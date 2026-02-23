import prisma from '@/configs/prisma.config';
import { TemplateCreateData, TemplateUpdateData } from '@/types/certificate.types';

export class TemplateRepository {
  async findById(id: string) {
    return prisma.certificate_template.findUnique({
      where: { id },
    });
  }

  async findByName(name: string) {
    return prisma.certificate_template.findUnique({
      where: { name },
    });
  }

  async create(data: TemplateCreateData) {
    return prisma.certificate_template.create({
      data: {
        name: data.name,
        filename: data.filename,
        width: data.width,
        height: data.height,
        default_full_name_x: data.default_full_name_x ?? 600,
        default_full_name_y: data.default_full_name_y ?? 400,
        default_full_name_size: data.default_full_name_size ?? 48,
        default_date_x: data.default_date_x ?? 600,
        default_date_y: data.default_date_y ?? 500,
        default_date_size: data.default_date_size ?? 28,
        default_control_x: data.default_control_x ?? 600,
        default_control_y: data.default_control_y ?? 600,
        default_control_size: data.default_control_size ?? 20,
      },
    });
  }

  async update(id: string, data: TemplateUpdateData) {
    // Filter out undefined values for Prisma compatibility
    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    return prisma.certificate_template.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    return prisma.certificate_template.delete({
      where: { id },
    });
  }

  async findAll(params: { skip?: number; take?: number }) {
    const { skip = 0, take = 10 } = params;

    const [templates, total] = await Promise.all([
      prisma.certificate_template.findMany({
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      prisma.certificate_template.count(),
    ]);

    return { templates, total };
  }
}

export const templateRepository = new TemplateRepository();
export default templateRepository;
