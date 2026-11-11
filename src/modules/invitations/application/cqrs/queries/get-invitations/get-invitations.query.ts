import { Query } from '@nestjs/cqrs';
import { Invitation } from 'src/modules/invitations/domain/entities/invitation';

export class GetInvitationsQuery extends Query<{
  items: Invitation[];
  total: number;
}> {
  constructor(
    public readonly adminUserId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly eventId?: string,
  ) {
    super();
  }
}
