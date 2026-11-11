import { Invitation } from 'src/modules/invitations/domain/entities/invitation';
import { InvitationId } from 'src/modules/invitations/domain/value-objects/invitation-id';
import { InvitationSlug } from 'src/modules/invitations/domain/value-objects/invitation-slug';

export abstract class InvitationRepository {
  abstract save(invitation: Invitation): Promise<void>;
  abstract update(invitation: Invitation): Promise<void>;
  abstract findAll(params: {
    adminUserId: string;
    eventId?: string;
    skip: number;
    take: number;
  }): Promise<{
    items: Invitation[];
    total: number;
  }>;
  abstract findById(id: InvitationId, adminUserId: string): Promise<Invitation | null>;
  abstract findBySlug(slug: InvitationSlug): Promise<Invitation | null>;
  abstract getStatistics(adminUserId: string): Promise<{
    totalInvitations: number;
    pendingInvitations: number;
    confirmedInvitations: number;
    declinedInvitations: number;
    totalAllowedSeats: number;
    totalConfirmedSeats: number;
  }>;
  abstract existsBySlug(slug: InvitationSlug): Promise<boolean>;
  abstract delete(id: InvitationId, adminUserId: string): Promise<void>;
}
