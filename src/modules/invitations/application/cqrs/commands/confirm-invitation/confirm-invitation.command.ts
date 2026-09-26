import { ICommand } from '@nestjs/cqrs';

export class ConfirmInvitationCommand implements ICommand {
  constructor(
    public readonly slug: string,
    public readonly attendees: number,
  ) {}
}
