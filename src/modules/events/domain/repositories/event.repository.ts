import { Event } from 'src/modules/events/domain/entities/event';
import { EventId } from 'src/modules/events/domain/value-objects/event-id';
import { EventSlug } from 'src/modules/events/domain/value-objects/event-slug';

export abstract class EventRepository {
  abstract save(event: Event): Promise<void>;

  abstract update(event: Event): Promise<void>;

  abstract findById(id: EventId, adminUserId: string): Promise<Event | null>;

  abstract findBySlug(
    slug: EventSlug,
    adminUserId: string,
  ): Promise<Event | null>;

  abstract existsBySlug(slug: EventSlug): Promise<boolean>;

  abstract findAll(params: {
    adminUserId: string;
    skip: number;
    take: number;
  }): Promise<{
    items: Event[];
    total: number;
  }>;

  abstract delete(id: EventId, adminUserId: string): Promise<void>;
}
