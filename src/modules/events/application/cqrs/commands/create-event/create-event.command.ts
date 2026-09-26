import { ICommand } from '@nestjs/cqrs';

export class CreateEventCommand implements ICommand {
  constructor(
    public readonly adminUserId: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly eventDate: Date,
    public readonly eventTime: string,
    public readonly venue: string,
  ) {}
}
