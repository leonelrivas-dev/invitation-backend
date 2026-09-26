import { admin_users } from 'src/generated/prisma/client';
import { AdminUser } from 'src/modules/auth/domain/entities/admin-user';
import { AdminUserId } from 'src/modules/auth/domain/value-objects/admin-user-id';
import { Email } from 'src/modules/auth/domain/value-objects/email';

export class AdminUserMapper {
  static toDomain(model: admin_users): AdminUser {
    return AdminUser.reconstitute({
      id: AdminUserId.from(model.id),
      email: Email.from(model.email),
      passwordHash: model.password_hash,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    });
  }
}
