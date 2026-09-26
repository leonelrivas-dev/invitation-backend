import { ICommand } from '@nestjs/cqrs';

export class DeclineInvitationCommand implements ICommand {
  constructor(public readonly slug: string) {}
}
