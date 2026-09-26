import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmInvitationCommand } from 'src/modules/invitations/application/cqrs/commands/confirm-invitation/confirm-invitation.command';
import { InvitationNotFoundError } from 'src/modules/invitations/domain/errors/invitation-not-found.error';
import { InvitationRepository } from 'src/modules/invitations/domain/repositories/invitation.repository';
import { InvitationSlug } from 'src/modules/invitations/domain/value-objects/invitation-slug';

@CommandHandler(ConfirmInvitationCommand)
export class ConfirmInvitationHandler implements ICommandHandler<ConfirmInvitationCommand> {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async execute(command: ConfirmInvitationCommand): Promise<void> {
    const slug = InvitationSlug.from(command.slug);
    const invitation = await this.invitationRepository.findBySlug(slug);

    if (!invitation) throw new InvitationNotFoundError(command.slug);

    invitation.confirm(command.attendees);

    await this.invitationRepository.update(invitation);
  }
}
