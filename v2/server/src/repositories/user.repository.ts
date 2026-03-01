import prisma from '@/configs/prisma.config';
import { user_status, Prisma } from '@/generated/prisma/client';

export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  status?: user_status;
  email_verified?: boolean;
  email_verified_at?: Date | string | null;
  password_changed_at?: Date | string;
  failed_login_attempts?: number;
  locked_until?: Date | string | null;
  last_login_at?: Date | string | null;
  last_activity_at?: Date | string | null;
  login_count?: number;
  done_onboarding?: boolean;
}

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByEmailWithTokens(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        refresh_tokens: {
          where: { is_active: true },
        },
      },
    });
  }

  async create(data: CreateUserData) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        status: user_status.PENDING_VERIFICATION,
        done_onboarding: false,
        role: 'USER',
      },
    });
  }

  async update(id: string, data: UpdateUserData) {
    return prisma.user.update({
      where: { id },
      data: data as Prisma.userUpdateInput,
    });
  }

  async incrementFailedAttempts(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        failed_login_attempts: { increment: 1 },
      },
    });
  }

  async resetFailedAttempts(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        failed_login_attempts: 0,
        locked_until: null,
      },
    });
  }

  async lockAccount(id: string, until: Date) {
    return prisma.user.update({
      where: { id },
      data: {
        locked_until: until,
      },
    });
  }

  async verifyEmail(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        email_verified: true,
        email_verified_at: new Date(),
        status: user_status.ACTIVE,
      },
    });
  }

  async updateLastLogin(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        last_login_at: new Date(),
        last_activity_at: new Date(),
        login_count: { increment: 1 },
        failed_login_attempts: 0,
        locked_until: null,
      },
    });
  }

  async updateLastActivity(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        last_activity_at: new Date(),
      },
    });
  }

  async softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        status: user_status.DELETED,
        deleted_at: new Date(),
      },
    });
  }

  async findAll(params: { skip?: number; take?: number; status?: user_status }) {
    const { skip = 0, take = 10, status } = params;

    const whereClause = status ? { status } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          role: true,
          status: true,
          email_verified: true,
          created_at: true,
          last_login_at: true,
        },
      }),
      prisma.user.count({
        where: whereClause,
      }),
    ]);

    return { users, total };
  }
}

export const userRepository = new UserRepository();
export default userRepository;
