export class InvitationEventId {
  private constructor(private readonly value: string) {}

  static create(value: string): InvitationEventId {
    if (!value) {
      throw new Error('Invitation event id cannot be empty');
    }

    return new InvitationEventId(value);
  }

  toString(): string {
    return this.value;
  }
}
