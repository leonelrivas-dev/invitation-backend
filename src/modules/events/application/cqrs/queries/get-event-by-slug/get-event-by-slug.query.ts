import { Query } from '@nestjs/cqrs';
import { Event } from 'src/modules/events/domain/entities/event';

export class GetEventBySlugQuery extends Query<Event> {
  constructor(
    public readonly slug: string,
    public readonly adminUserId: string,
  ) {
    super();
  }
}
