export class EventHasInvitationsError extends Error {
  readonly code = 'EVENT_HAS_INVITATIONS';

  constructor() {
    super('The event cannot be deleted because it has invitations');
  }
}
