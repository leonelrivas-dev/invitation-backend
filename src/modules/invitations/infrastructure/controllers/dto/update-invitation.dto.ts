import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UpdateInvitationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsInt()
  @Min(1)
  allowedSeats!: number;
}
