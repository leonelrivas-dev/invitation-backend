import { Invitation } from 'src/modules/invitations/domain/entities/invitation';
import { InvitationStatus } from 'src/modules/invitations/domain/enums/invitation-status';

export class PublicInvitationResponseDto {
  id!: string;
  name!: string;
  slug!: string;
  allowedSeats!: number;
  confirmedSeats!: number;
  status!: InvitationStatus;

  static fromDomain(invitation: Invitation): PublicInvitationResponseDto {
    const dto = new PublicInvitationResponseDto();

    dto.id = invitation.id.toString();
    dto.name = invitation.name;
    dto.slug = invitation.slug.toString();
    dto.allowedSeats = invitation.allowedSeats;
    dto.confirmedSeats = invitation.confirmedSeats;
    dto.status = invitation.status;

    return dto;
  }
}
