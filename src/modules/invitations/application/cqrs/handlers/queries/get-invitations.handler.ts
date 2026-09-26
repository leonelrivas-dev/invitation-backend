import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetInvitationsQuery } from 'src/modules/invitations/application/cqrs/queries/get-invitations/get-invitations.query';
import { Invitation } from 'src/modules/invitations/domain/entities/invitation';
import { InvitationRepository } from 'src/modules/invitations/domain/repositories/invitation.repository';

@QueryHandler(GetInvitationsQuery)
export class GetInvitationsHandler implements IQueryHandler<GetInvitationsQuery> {
  constructor(private readonly ivnitationRepository: InvitationRepository) {}

  async execute(
    query: GetInvitationsQuery,
  ): Promise<{ items: Invitation[]; total: number }> {
    const page = Math.max(query.page, 1);
    const limit = Math.min(Math.max(query.limit, 1), 100);

    const skip = (page - 1) * limit;

    return this.ivnitationRepository.findAll({
      skip,
      take: limit,
    });
  }
}
