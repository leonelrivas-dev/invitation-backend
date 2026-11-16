import { ICommand } from '@nestjs/cqrs';

export class MarkMessageSentCommand implements ICommand {
  constructor(
    public readonly adminUserId: string,
    public readonly id: string,
  ) {}
}
