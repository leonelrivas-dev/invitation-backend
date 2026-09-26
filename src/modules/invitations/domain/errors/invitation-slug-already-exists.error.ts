import { DomainError } from 'src/shared/domain/errors/domain-error';

export class InvitationSlugAlreadyExistsError extends DomainError {
  readonly code = 'INVITATION_SLUG_ALREADY_EXISTS';

  constructor(slug: string) {
    super(`Invitation slug ${slug} already exists`);
  }
}
