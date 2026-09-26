import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MarkMessageSentCommand } from 'src/modules/invitations/application/cqrs/commands/mark-message-sent/mark-message-sent.command';
import { InvitationNotFoundError } from 'src/modules/invitations/domain/errors/invitation-not-found.error';
import { InvitationRepository } from 'src/modules/invitations/domain/repositories/invitation.repository';
import { InvitationId } from 'src/modules/invitations/domain/value-objects/invitation-id';

@CommandHandler(MarkMessageSentCommand)
export class MarkMessageSentHandle implements ICommandHandler<MarkMessageSentCommand> {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async execute(command: MarkMessageSentCommand): Promise<void> {
    const id = InvitationId.from(command.id);
    const invitation = await this.invitationRepository.findById(id);

    if (!invitation) throw new InvitationNotFoundError(command.id);

    invitation.markMessageAsSent();

    await this.invitationRepository.update(invitation);
  }
}
