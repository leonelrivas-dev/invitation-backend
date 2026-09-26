import { AdminUserId } from 'src/modules/auth/domain/value-objects/admin-user-id';
import { Email } from 'src/modules/auth/domain/value-objects/email';

interface AdminUserProps {
  id: AdminUserId;
  email: Email;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AdminUser {
  private constructor(private readonly props: AdminUserProps) {}

  static reconstitute(props: AdminUserProps): AdminUser {
    return new AdminUser(props);
  }

  get id(): AdminUserId {
    return this.props.id;
  }

  get email(): Email {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
