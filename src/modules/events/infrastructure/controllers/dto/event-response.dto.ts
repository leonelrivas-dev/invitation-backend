import { Event } from 'src/modules/events/domain/entities/event';

export class EventResponseDto {
  id!: string;
  name!: string;
  slug!: string;
  eventDate!: Date;
  eventTime!: string;
  venue!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static fromDomain(event: Event): EventResponseDto {
    const dto = new EventResponseDto();

    dto.id = event.id.toString();
    dto.name = event.name;
    dto.slug = event.slug.toString();
    dto.eventDate = event.eventDate;
    dto.eventTime = event.eventTime;
    dto.venue = event.venue;
    dto.createdAt = event.createdAt;
    dto.updatedAt = event.updatedAt;

    return dto;
  }
}
