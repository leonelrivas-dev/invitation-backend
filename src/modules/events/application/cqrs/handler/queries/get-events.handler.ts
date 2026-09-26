import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  GetEventsQuery,
  GetEventsResult,
} from 'src/modules/events/application/cqrs/queries/get-events/get-events.query';
import { EventRepository } from 'src/modules/events/domain/repositories/event.repository';

@QueryHandler(GetEventsQuery)
export class GetEventsHandler implements IQueryHandler<GetEventsQuery> {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(query: GetEventsQuery): Promise<GetEventsResult> {
    const page = Math.max(1, query.page);
    const limit = Math.max(1, query.limit);

    const skip = (page - 1) * limit;

    return this.eventRepository.findAll({
      adminUserId: query.adminUserId,
      skip,
      take: limit,
    });
  }
}
