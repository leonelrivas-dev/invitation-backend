import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetInvitationBySlugQuery } from 'src/modules/invitations/application/cqrs/queries/get-invitation-by-slug/get-invitation-by-slug.query';
import { Invitation } from 'src/modules/invitations/domain/entities/invitation';
import { InvitationNotFoundError } from 'src/modules/invitations/domain/errors/invitation-not-found.error';
import { InvitationRepository } from 'src/modules/invitations/domain/repositories/invitation.repository';
import { InvitationSlug } from 'src/modules/invitations/domain/value-objects/invitation-slug';

@QueryHandler(GetInvitationBySlugQuery)
export class GetInvitationBySlugHandler implements IQueryHandler<GetInvitationBySlugQuery> {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async execute(query: GetInvitationBySlugQuery): Promise<Invitation> {
    const slug = InvitationSlug.from(query.slug);
    const invitation = await this.invitationRepository.findBySlug(slug);

    if (!invitation) throw new InvitationNotFoundError(query.slug);

    return invitation;
  }
}
