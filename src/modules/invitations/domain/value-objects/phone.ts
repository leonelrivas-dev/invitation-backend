export class Phone {
  private constructor(private readonly value: string) {}

  static from(value: string): Phone {
    const normalizedValue = value.trim();

    if (!normalizedValue) throw new Error('Phone cannot be empty');

    return new Phone(normalizedValue);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Phone): boolean {
    return this.value === other.value;
  }
}
