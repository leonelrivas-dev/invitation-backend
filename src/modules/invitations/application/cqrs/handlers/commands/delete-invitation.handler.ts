import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteInvitationCommand } from 'src/modules/invitations/application/cqrs/commands/delete-invitation/delete-invitation.command';
import { InvitationNotFoundError } from 'src/modules/invitations/domain/errors/invitation-not-found.error';
import { InvitationRepository } from 'src/modules/invitations/domain/repositories/invitation.repository';
import { InvitationId } from 'src/modules/invitations/domain/value-objects/invitation-id';

@CommandHandler(DeleteInvitationCommand)
export class DeleteInvitationHandler implements ICommandHandler<DeleteInvitationCommand> {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async execute(command: DeleteInvitationCommand): Promise<void> {
    const id = InvitationId.from(command.id);

    const invitation = await this.invitationRepository.findById(id);

    if (!invitation) throw new InvitationNotFoundError(command.id);

    await this.invitationRepository.delete(id);
  }
}
