import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEventsByIdQuery } from 'src/modules/events/application/cqrs/queries/get-event-by-id/get-event-by-id.query';
import { Event } from 'src/modules/events/domain/entities/event';
import { EventNotFoundError } from 'src/modules/events/domain/errors/event-not-found.error';
import { EventRepository } from 'src/modules/events/domain/repositories/event.repository';
import { EventId } from 'src/modules/events/domain/value-objects/event-id';

@QueryHandler(GetEventsByIdQuery)
export class GetEventByIdHandler implements IQueryHandler<GetEventsByIdQuery> {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(query: GetEventsByIdQuery): Promise<Event> {
    const event = await this.eventRepository.findById(
      EventId.from(query.id),
      query.adminUserId,
    );

    if (!event) {
      throw new EventNotFoundError();
    }

    return event;
  }
}
