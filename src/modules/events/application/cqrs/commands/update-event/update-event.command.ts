import { ICommand } from '@nestjs/cqrs';

export class UpdateEventCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly adminUserId: string,
    public readonly name: string,
    public readonly eventDate: Date,
    public readonly eventTime: string,
    public readonly venue: string,
  ) {}
}
