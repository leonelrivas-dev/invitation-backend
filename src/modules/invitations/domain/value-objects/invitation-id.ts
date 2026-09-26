import { randomUUID } from 'node:crypto';

export class InvitationId {
  private constructor(private readonly value: string) {}

  static create(): InvitationId {
    return new InvitationId(randomUUID());
  }

  static from(value: string): InvitationId {
    if (!value) throw new Error('Invitation ID cannot be empty');

    return new InvitationId(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: InvitationId): boolean {
    return this.value == other.value;
  }
}
