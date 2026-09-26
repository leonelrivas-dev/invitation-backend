import { eventsModel } from 'src/generated/prisma/models';
import { Event } from 'src/modules/events/domain/entities/event';
import { EventId } from 'src/modules/events/domain/value-objects/event-id';
import { EventSlug } from 'src/modules/events/domain/value-objects/event-slug';

export class EventMapper {
  static toDomain(model: eventsModel): Event {
    return Event.reconstitute({
      id: EventId.from(model.id),
      adminUserId: model.admin_user_id,
      name: model.name,
      slug: EventSlug.from(model.slug),
      eventDate: model.event_date,
      eventTime: this.dateToTime(model.event_time),
      venue: model.venue,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    });
  }

  static toPersistence(event: Event) {
    return {
      id: event.id.toString(),
      name: event.name,
      slug: event.slug.toString(),
      event_date: event.eventDate,
      event_time: this.timeToDate(event.eventTime),
      venue: event.venue,
      created_at: event.createdAt,
      updated_at: event.updatedAt,
      admin_user_id: event.adminUserId,
    };
  }

  private static dateToTime(value: Date): string {
    const hours = value.getUTCHours().toString().padStart(2, '0');

    const minutes = value.getUTCMinutes().toString().padStart(2, '0');

    const seconds = value.getUTCSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  private static timeToDate(value: string): Date {
    const [hours, minutes, seconds] = value.split(':').map(Number);

    return new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds ?? 0));
  }
}
