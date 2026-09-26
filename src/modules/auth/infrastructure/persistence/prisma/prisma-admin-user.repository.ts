import { Injectable } from '@nestjs/common';
import { AdminUser } from 'src/modules/auth/domain/entities/admin-user';
import { AdminUserRepository } from 'src/modules/auth/domain/repositories/admin-user.repository';
import { Email } from 'src/modules/auth/domain/value-objects/email';
import { AdminUserMapper } from 'src/modules/auth/infrastructure/persistence/prisma/mapper/admin-user.mapper';
import { PrismaService } from 'src/shared/infrastructure/database/prisma.service';

@Injectable()
export class PrismaAdminUserRepository implements AdminUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: Email): Promise<AdminUser | null> {
    const model = await this.prisma.admin_users.findUnique({
      where: {
        email: email.toString(),
      },
    });

    if (!model) return null;

    return AdminUserMapper.toDomain(model);
  }

  async findById(id: string): Promise<AdminUser | null> {
    const model = await this.prisma.admin_users.findUnique({
      where: {
        id,
      },
    });

    if (!model) return null;

    return AdminUserMapper.toDomain(model);
  }
}
