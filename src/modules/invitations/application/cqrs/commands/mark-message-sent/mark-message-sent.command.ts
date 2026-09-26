import { ICommand } from '@nestjs/cqrs';

export class MarkMessageSentCommand implements ICommand {
  constructor(public readonly id: string) {}
}
