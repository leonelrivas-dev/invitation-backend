import { DomainError } from 'src/shared/domain/errors/domain-error';

export class InvalidRefreshTokenError extends DomainError {
  readonly code = 'INVALID_REFRESH_TOKEN';

  constructor() {
    super('Invalid refresh token');
  }
}
