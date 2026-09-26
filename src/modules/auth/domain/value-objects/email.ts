export class Email {
  private constructor(private readonly value: string) {}

  static from(value: string): Email {
    const normalized = value.trim().toLowerCase();

    if (!normalized) throw new Error('Email cannot be empty');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) throw new Error('Invalid emial format');

    return new Email(normalized);
  }

  toString(): string {
    return this.value;
  }
}
