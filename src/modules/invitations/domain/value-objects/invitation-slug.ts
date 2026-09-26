export class InvitationSlug {
  private constructor(private readonly value: string) {}

  static from(value: string): InvitationSlug {
    const normalizedValue = value.trim().toLowerCase();

    if (!normalizedValue) throw new Error('Invitation Slug cannot be empty');

    return new InvitationSlug(normalizedValue);
  }

  toString(): string {
    return this.value;
  }

  equals(other: InvitationSlug): boolean {
    return this.value === other.value;
  }
}
