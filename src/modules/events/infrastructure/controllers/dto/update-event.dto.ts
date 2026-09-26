import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDateString()
  eventDate!: string;

  @IsString()
  @IsNotEmpty()
  eventTime!: string;

  @IsString()
  @IsNotEmpty()
  venue!: string;
}
