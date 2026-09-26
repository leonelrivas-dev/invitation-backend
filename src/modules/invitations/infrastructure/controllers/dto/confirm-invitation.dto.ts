import { IsInt, Min } from 'class-validator';

export class ConfirmInvitationDto {
  @IsInt()
  @Min(1)
  attendees!: number;
}
