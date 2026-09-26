import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  GetInvitationStatisticsQuery,
  InvitationStatistics,
} from 'src/modules/invitations/application/cqrs/queries/get-invitation-statistics/get-invitation-statistics.query';
import { InvitationRepository } from 'src/modules/invitations/domain/repositories/invitation.repository';

@QueryHandler(GetInvitationStatisticsQuery)
export class GetInvitationStatisticsHandler implements IQueryHandler<GetInvitationStatisticsQuery> {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async execute(
    query: GetInvitationStatisticsQuery,
  ): Promise<InvitationStatistics> {
    return this.invitationRepository.getStatistics();
  }
}
