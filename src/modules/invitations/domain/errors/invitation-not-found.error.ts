import { DomainError } from 'src/shared/domain/errors/domain-error';

export class InvitationNotFoundError extends DomainError {
  readonly code = 'INVITATION_NOT_FOUND';
  constructor(identifier: string) {
    super(`Invitation "${identifier}" was not found`);

    this.name = 'InvitationNotFoundError';
  }
}
