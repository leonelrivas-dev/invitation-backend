import { Query } from '@nestjs/cqrs';

export interface InvitationStatistics {
  totalInvitations: number;
  pendingInvitations: number;
  confirmedInvitations: number;
  declinedInvitations: number;
  totalAllowedSeats: number;
  totalConfirmedSeats: number;
}

export class GetInvitationStatisticsQuery extends Query<InvitationStatistics> {
  constructor() {
    super();
  }
}
