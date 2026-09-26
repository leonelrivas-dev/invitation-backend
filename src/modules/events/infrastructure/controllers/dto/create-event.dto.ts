import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsDateString()
  eventDate!: string;

  @IsString()
  @IsNotEmpty()
  eventTime!: string;

  @IsString()
  @IsNotEmpty()
  venue!: string;
}
