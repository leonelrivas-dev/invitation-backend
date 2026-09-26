import { randomUUID } from 'crypto';

export class EventId {
  private constructor(private readonly value: string) {}

  static create(): EventId {
    return new EventId(randomUUID());
  }

  static from(value: string): EventId {
    if (!value || !value.trim()) {
      throw new Error('Event id cannot be empty');
    }

    return new EventId(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: EventId): boolean {
    return this.value === other.value;
  }
}
