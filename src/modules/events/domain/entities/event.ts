import { EventId } from 'src/modules/events/domain/value-objects/event-id';
import { EventSlug } from 'src/modules/events/domain/value-objects/event-slug';

export interface EventProps {
  id: EventId;
  adminUserId: string;
  name: string;
  slug: EventSlug;
  eventDate: Date;
  eventTime: string;
  venue: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Event {
  private constructor(private readonly props: EventProps) {}

  static create(params: {
    adminUserId: string;
    name: string;
    slug: EventSlug;
    eventDate: Date;
    eventTime: string;
    venue: string;
  }): Event {
    if (!params.name.trim()) {
      throw new Error('Event name cannot be empty');
    }

    if (!params.venue.trim()) {
      throw new Error('Event venue cannot be empty');
    }

    const now = new Date();

    return new Event({
      id: EventId.create(),
      adminUserId: params.adminUserId,
      name: params.name.trim(),
      slug: params.slug,
      eventDate: params.eventDate,
      eventTime: params.eventTime,
      venue: params.venue.trim(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: EventProps): Event {
    return new Event(props);
  }

  get id(): EventId {
    return this.props.id;
  }

  get adminUserId(): string {
    return this.props.adminUserId;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): EventSlug {
    return this.props.slug;
  }

  get eventDate(): Date {
    return this.props.eventDate;
  }

  get eventTime(): string {
    return this.props.eventTime;
  }

  get venue(): string {
    return this.props.venue;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  update(params: {
    name: string;
    eventDate: Date;
    eventTime: string;
    venue: string;
  }): void {
    if (!params.name.trim()) {
      throw new Error('Event name cannot be empty');
    }

    if (!params.venue.trim()) {
      throw new Error('Event venue cannot be empty');
    }

    this.props.name = params.name.trim();
    this.props.eventDate = params.eventDate;
    this.props.eventTime = params.eventTime;
    this.props.venue = params.venue.trim();
    this.props.updatedAt = new Date();
  }
}
