import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';
export class CreateInvitationDto {
  @IsUUID()
  @IsNotEmpty()
  eventId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsInt()
  @Min(1)
  allowedSeats!: number;
}
