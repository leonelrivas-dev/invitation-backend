import { Query } from '@nestjs/cqrs';
import { Invitation } from 'src/modules/invitations/domain/entities/invitation';

export class GetInvitationBySlugQuery extends Query<Invitation> {
  constructor(public readonly slug: string) {
    super();
  }
}
