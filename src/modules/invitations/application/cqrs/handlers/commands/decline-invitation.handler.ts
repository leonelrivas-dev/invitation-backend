import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeclineInvitationCommand } from 'src/modules/invitations/application/cqrs/commands/decline-invitation/decline-invitation.command';
import { InvitationNotFoundError } from 'src/modules/invitations/domain/errors/invitation-not-found.error';
import { InvitationRepository } from 'src/modules/invitations/domain/repositories/invitation.repository';
import { InvitationSlug } from 'src/modules/invitations/domain/value-objects/invitation-slug';

@CommandHandler(DeclineInvitationCommand)
export class DeclineInvitationHandler implements ICommandHandler<DeclineInvitationCommand> {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async execute(command: DeclineInvitationCommand): Promise<void> {
    const slug = InvitationSlug.from(command.slug);

    const invitation = await this.invitationRepository.findBySlug(slug);

    if (!invitation) throw new InvitationNotFoundError(command.slug);

    invitation.decline();

    await this.invitationRepository.update(invitation);
  }
}
