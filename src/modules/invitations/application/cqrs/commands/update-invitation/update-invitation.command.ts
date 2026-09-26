import { ICommand } from '@nestjs/cqrs';

export class UpdateInvitationCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly phone: string,
    public readonly allowedSeats: number,
  ) {}
}
