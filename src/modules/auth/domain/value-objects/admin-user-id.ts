import { randomUUID } from 'crypto';

export class AdminUserId {
  private constructor(private readonly value: string) {}

  static create(): AdminUserId {
    return new AdminUserId(randomUUID());
  }

  static from(value: string): AdminUserId {
    if (!value) throw new Error('Admin user ID cannot be empty');

    return new AdminUserId(value);
  }

  toString(): string {
    return this.value;
  }
}
