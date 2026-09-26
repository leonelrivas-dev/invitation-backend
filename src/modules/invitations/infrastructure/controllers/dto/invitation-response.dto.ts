import { Invitation } from 'src/modules/invitations/domain/entities/invitation';
import { InvitationStatus } from 'src/modules/invitations/domain/enums/invitation-status';

export class InvitationResponseDto {
  id!: string;
  name!: string;
  slug!: string;
  phone!: string;
  allowedSeats!: number;
  confirmedSeats!: number;
  status!: InvitationStatus;
  messageSentAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;

  static fromDomain(invitation: Invitation): InvitationResponseDto {
    const response = new InvitationResponseDto();

    response.id = invitation.id.toString();
    response.name = invitation.name;
    response.slug = invitation.slug.toString();
    response.phone = invitation.phone.toString();
    response.allowedSeats = invitation.allowedSeats;
    response.confirmedSeats = invitation.confirmedSeats;
    response.status = invitation.status;
    response.messageSentAt = invitation.messageSentAt;
    response.createdAt = invitation.createdAt;
    response.updatedAt = invitation.updatedAt;

    return response;
  }
}
