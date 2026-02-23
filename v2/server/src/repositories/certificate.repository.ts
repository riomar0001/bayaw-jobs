import prisma from '@/configs/prisma.config';
import { CertificateCreateData, TextPosition } from '@/types/certificate.types';
import type { Prisma } from '@/generated/prisma/client';

export class CertificateRepository {
  async findById(id: string) {
    return prisma.certificate.findUnique({
      where: { id },
      include: {
        full_name: true,
        date: true,
        control_number_position: true,
        created_by: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
  }

  async findByControlNumber(controlNumber: string) {
    return prisma.certificate.findUnique({
      where: { control_number: controlNumber },
      include: {
        full_name: true,
        date: true,
        control_number_position: true,
      },
    });
  }

  async create(data: CertificateCreateData) {
    const createData: Prisma.certificateCreateInput = {
      control_number: data.control_number,
      recipient_email: data.recipient_email,
      template_image: data.template_image,
      created_by: {
        connect: { id: data.created_by_id },
      },
      full_name: {
        create: this.mapTextPosition(data.fullName),
      },
      date: {
        create: this.mapTextPosition(data.date),
      },
      control_number_position: {
        create: this.mapTextPosition(data.controlNumber),
      },
    };

    return prisma.certificate.create({
      data: createData,
      include: {
        full_name: true,
        date: true,
        control_number_position: true,
      },
    });
  }

  async updateSentAt(id: string) {
    return prisma.certificate.update({
      where: { id },
      data: {
        sent_at: new Date(),
      },
    });
  }

  async findAll(params: {
    skip?: number | undefined;
    take?: number | undefined;
    recipientEmail?: string | undefined;
    createdById?: string | undefined;
  }) {
    const { skip = 0, take = 10, recipientEmail, createdById } = params;

    const where: Record<string, unknown> = {};
    if (recipientEmail) {
      where.recipient_email = recipientEmail;
    }
    if (createdById) {
      where.created_by_id = createdById;
    }

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          full_name: true,
          date: true,
          control_number_position: true,
          created_by: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      }),
      prisma.certificate.count({ where }),
    ]);

    return { certificates, total };
  }

  async delete(id: string) {
    return prisma.certificate.delete({
      where: { id },
    });
  }

  private mapTextPosition(position: TextPosition) {
    return {
      text: position.text,
      x: position.x,
      y: position.y,
      font_size: position.fontSize ?? 28,
      color: position.color ?? '#000000',
      font_weight: position.fontWeight ?? 'normal',
    };
  }
}

export const certificateRepository = new CertificateRepository();
export default certificateRepository;
