import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateInvitationCommand } from 'src/modules/invitations/application/cqrs/commands/update-invitation/update-invitation.command';
import { InvitationNotFoundError } from 'src/modules/invitations/domain/errors/invitation-not-found.error';
import { InvitationRepository } from 'src/modules/invitations/domain/repositories/invitation.repository';
import { InvitationId } from 'src/modules/invitations/domain/value-objects/invitation-id';
import { Phone } from 'src/modules/invitations/domain/value-objects/phone';

@CommandHandler(UpdateInvitationCommand)
export class UpdateInvitationHandler implements ICommandHandler<UpdateInvitationCommand> {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async execute(command: UpdateInvitationCommand): Promise<void> {
    const id = InvitationId.from(command.id);
    const invitation = await this.invitationRepository.findById(id);

    if (!invitation) throw new InvitationNotFoundError(command.id);

    const phone = Phone.from(command.phone);

    invitation.updateDetails({
      name: command.name,
      phone,
      allowedSeats: command.allowedSeats,
    });

    await this.invitationRepository.update(invitation);
  }
}
