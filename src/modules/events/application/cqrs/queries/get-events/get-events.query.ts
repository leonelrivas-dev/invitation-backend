import { Query } from '@nestjs/cqrs';
import { Event } from 'src/modules/events/domain/entities/event';

export interface GetEventsResult {
  items: Event[];
  total: number;
}

export class GetEventsQuery extends Query<GetEventsResult> {
  constructor(
    public readonly adminUserId: string,
    public readonly page: number,
    public readonly limit: number,
  ) {
    super();
  }
}
