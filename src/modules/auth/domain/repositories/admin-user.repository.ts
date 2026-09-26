import { AdminUser } from 'src/modules/auth/domain/entities/admin-user';
import { Email } from 'src/modules/auth/domain/value-objects/email';

export abstract class AdminUserRepository {
  abstract findByEmail(email: Email): Promise<AdminUser | null>;

  abstract findById(id: string): Promise<AdminUser | null>;
}
