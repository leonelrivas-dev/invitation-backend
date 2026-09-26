import { DomainError } from 'src/shared/domain/errors/domain-error';

export class EventNotFoundError extends DomainError {
  readonly code = 'EVENT_NOT_FOUND';

  constructor() {
    super('Event not found');
  }
}
