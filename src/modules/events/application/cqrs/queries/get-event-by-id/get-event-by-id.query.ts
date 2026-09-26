import { Query } from '@nestjs/cqrs';
import { Event } from 'src/modules/events/domain/entities/event';

export class GetEventsByIdQuery extends Query<Event> {
  constructor(
    public readonly id: string,
    public readonly adminUserId: string,
  ) {
    super();
  }
}
