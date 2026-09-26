import { ICommand } from '@nestjs/cqrs';

export class DeleteInvitationCommand implements ICommand {
  constructor(public readonly id: string) {}
}
