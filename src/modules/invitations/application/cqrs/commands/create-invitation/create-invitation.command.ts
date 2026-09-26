import { ICommand } from '@nestjs/cqrs';

export class CreateInvitationCommand implements ICommand {
  constructor(
    public readonly eventId: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly phone: string,
    public readonly allowedSeats: number,
  ) {}
}
