import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetInvitationQuery } from 'src/modules/invitations/application/cqrs/queries/get-invitation/get-invitation.query';
import { Invitation } from 'src/modules/invitations/domain/entities/invitation';
import { InvitationNotFoundError } from 'src/modules/invitations/domain/errors/invitation-not-found.error';
import { InvitationRepository } from 'src/modules/invitations/domain/repositories/invitation.repository';
import { InvitationId } from 'src/modules/invitations/domain/value-objects/invitation-id';

@QueryHandler(GetInvitationQuery)
export class GetInvitationHandler implements IQueryHandler<GetInvitationQuery> {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async execute(query: GetInvitationQuery): Promise<Invitation> {
    const id = InvitationId.from(query.id);
    const invitation = await this.invitationRepository.findById(id);

    if (!invitation) throw new InvitationNotFoundError(query.id);

    return invitation;
  }
}
