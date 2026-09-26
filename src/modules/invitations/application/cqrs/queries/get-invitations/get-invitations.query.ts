import { Query } from '@nestjs/cqrs';
import { Invitation } from 'src/modules/invitations/domain/entities/invitation';

export class GetInvitationsQuery extends Query<{
  items: Invitation[];
  total: number;
}> {
  constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {
    super();
  }
}
