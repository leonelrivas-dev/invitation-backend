import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateInvitationCommand } from 'src/modules/invitations/application/cqrs/commands/create-invitation/create-invitation.command';
import { Invitation } from 'src/modules/invitations/domain/entities/invitation';
import { InvitationSlugAlreadyExistsError } from 'src/modules/invitations/domain/errors/invitation-slug-already-exists.error';
import { InvitationRepository } from 'src/modules/invitations/domain/repositories/invitation.repository';
import { InvitationSlug } from 'src/modules/invitations/domain/value-objects/invitation-slug';
import { Phone } from 'src/modules/invitations/domain/value-objects/phone';

@CommandHandler(CreateInvitationCommand)
export class CreateInvitationHandler implements ICommandHandler<CreateInvitationCommand> {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async execute(command: CreateInvitationCommand): Promise<void> {
    const slug = InvitationSlug.from(command.slug);

    const slugAlreadyExists =
      await this.invitationRepository.existsBySlug(slug);

    if (slugAlreadyExists)
      throw new InvitationSlugAlreadyExistsError(
        `Invitation with slug "${slug.toString()}" already exists`,
      );

    const phone = Phone.from(command.phone);
    const invitation = Invitation.create({
      eventId: command.eventId,
      name: command.name,
      slug,
      phone,
      allowedSeats: command.allowedSeats,
    });

    await this.invitationRepository.save(invitation);
  }
}
