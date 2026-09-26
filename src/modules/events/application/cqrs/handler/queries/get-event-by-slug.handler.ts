import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEventBySlugQuery } from 'src/modules/events/application/cqrs/queries/get-event-by-slug/get-event-by-slug.query';
import { Event } from 'src/modules/events/domain/entities/event';
import { EventNotFoundError } from 'src/modules/events/domain/errors/event-not-found.error';
import { EventRepository } from 'src/modules/events/domain/repositories/event.repository';
import { EventSlug } from 'src/modules/events/domain/value-objects/event-slug';

@QueryHandler(GetEventBySlugQuery)
export class GetEventBySlugHandler implements IQueryHandler<GetEventBySlugQuery> {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(query: GetEventBySlugQuery): Promise<Event> {
    const event = await this.eventRepository.findBySlug(
      EventSlug.from(query.slug),
      query.adminUserId,
    );

    if (!event) {
      throw new EventNotFoundError();
    }

    return event;
  }
}
