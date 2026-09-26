import { invitation_status } from 'src/generated/prisma/client';
import { invitationsModel } from 'src/generated/prisma/models';
import { Invitation } from 'src/modules/invitations/domain/entities/invitation';
import { InvitationStatus } from 'src/modules/invitations/domain/enums/invitation-status';
import { InvitationId } from 'src/modules/invitations/domain/value-objects/invitation-id';
import { InvitationSlug } from 'src/modules/invitations/domain/value-objects/invitation-slug';
import { Phone } from 'src/modules/invitations/domain/value-objects/phone';

export class InvitationMapper {
  static toDomain(model: invitationsModel): Invitation {
    return Invitation.reconstitute({
      id: InvitationId.from(model.id),
      eventId: model.event_id,
      name: model.name,
      slug: InvitationSlug.from(model.slug),
      phone: Phone.from(model.phone),
      allowedSeats: model.allowed_seats,
      confirmedSeats: model.confirmed_seats,
      status: this.toDomainStatus(model.status),
      messageSentAt: model.message_sent_at,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    });
  }

  static toPersistence(invitation: Invitation) {
    return {
      id: invitation.id.toString(),
      event_id: invitation.eventId,
      name: invitation.name,
      slug: invitation.slug.toString(),
      phone: invitation.phone.toString(),
      allowed_seats: invitation.allowedSeats,
      confirmed_seats: invitation.confirmedSeats,
      status: this.toPersistenceStatus(invitation.status),
      message_sent_at: invitation.messageSentAt,
      created_at: invitation.createdAt,
      updated_at: invitation.updatedAt,
    };
  }

  private static toDomainStatus(status: invitation_status): InvitationStatus {
    switch (status) {
      case invitation_status.PENDING:
        return InvitationStatus.PENDING;

      case invitation_status.CONFIRMED:
        return InvitationStatus.CONFIRMED;

      case invitation_status.DECLINED:
        return InvitationStatus.DECLINED;

      default:
        throw new Error(`Unknow invitation state`);
    }
  }

  private static toPersistenceStatus(
    status: InvitationStatus,
  ): invitation_status {
    switch (status) {
      case InvitationStatus.PENDING:
        return invitation_status.PENDING;

      case InvitationStatus.CONFIRMED:
        return invitation_status.CONFIRMED;

      case InvitationStatus.DECLINED:
        return invitation_status.DECLINED;

      default:
        throw new Error(`Unknow invitation state`);
    }
  }
}
