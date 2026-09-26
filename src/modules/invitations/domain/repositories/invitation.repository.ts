import { Invitation } from 'src/modules/invitations/domain/entities/invitation';
import { InvitationId } from 'src/modules/invitations/domain/value-objects/invitation-id';
import { InvitationSlug } from 'src/modules/invitations/domain/value-objects/invitation-slug';

export abstract class InvitationRepository {
  abstract save(invitation: Invitation): Promise<void>;
  abstract update(invitation: Invitation): Promise<void>;
  abstract findAll(params: { skip: number; take: number }): Promise<{
    items: Invitation[];
    total: number;
  }>;
  abstract findById(id: InvitationId): Promise<Invitation | null>;
  abstract findBySlug(slug: InvitationSlug): Promise<Invitation | null>;
  abstract getStatistics(): Promise<{
    totalInvitations: number;
    pendingInvitations: number;
    confirmedInvitations: number;
    declinedInvitations: number;
    totalAllowedSeats: number;
    totalConfirmedSeats: number;
  }>;
  abstract existsBySlug(slug: InvitationSlug): Promise<boolean>;
  abstract delete(id: InvitationId): Promise<void>;
}
