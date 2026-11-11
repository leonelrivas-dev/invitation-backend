import { ICommand } from '@nestjs/cqrs';

export class DeleteInvitationCommand implements ICommand {
  constructor(
    public readonly adminUserId: string,
    public readonly id: string,
  ) {}
}
