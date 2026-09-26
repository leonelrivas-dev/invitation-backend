import { Query } from '@nestjs/cqrs';
import { Invitation } from 'src/modules/invitations/domain/entities/invitation';

export class GetInvitationQuery extends Query<Invitation> {
  constructor(public readonly id: string) {
    super();
  }
}
