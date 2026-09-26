export class EventSlug {
  private constructor(private readonly value: string) {}

  static create(value: string): EventSlug {
    const normalized = value.trim().toLowerCase();

    if (!normalized) {
      throw new Error('Event slug cannot be empty');
    }

    return new EventSlug(normalized);
  }

  static from(value: string): EventSlug {
    if (!value || !value.trim()) {
      throw new Error('Event slug cannot be empty');
    }

    return new EventSlug(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: EventSlug): boolean {
    return this.value === other.value;
  }
}
