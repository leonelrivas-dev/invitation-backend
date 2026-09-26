import { DomainError } from 'src/shared/domain/errors/domain-error';

export class InvalidInvitationError extends DomainError {
  readonly code = 'INVALID_INVITATION';

  constructor(message: string) {
    super(message);
  }
}
