import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Event } from 'src/modules/events/domain/entities/event';
import { EventNotFoundError } from 'src/modules/events/domain/errors/event-not-found.error';
import { EventRepository } from 'src/modules/events/domain/repositories/event.repository';
import { EventId } from 'src/modules/events/domain/value-objects/event-id';
import { GenerateWhatsAppLinkQuery } from 'src/modules/invitations/application/cqrs/queries/generate-whatsapp-link/generate-whatsapp-link.query';
import type { WhatsAppLinkGenerator } from 'src/modules/invitations/application/ports/whatsapp-link-generator';
import { WHATSAPP_LINK_GENERATOR } from 'src/modules/invitations/application/ports/whatsapp-link-generator.token';
import { Invitation } from 'src/modules/invitations/domain/entities/invitation';
import { InvitationNotFoundError } from 'src/modules/invitations/domain/errors/invitation-not-found.error';
import { InvitationRepository } from 'src/modules/invitations/domain/repositories/invitation.repository';
import { InvitationId } from 'src/modules/invitations/domain/value-objects/invitation-id';

@QueryHandler(GenerateWhatsAppLinkQuery)
export class GenerateWhatsAppLinkHandler implements IQueryHandler<GenerateWhatsAppLinkQuery> {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly eventRepository: EventRepository,
    @Inject(WHATSAPP_LINK_GENERATOR)
    private readonly whatsAppLinkGenerator: WhatsAppLinkGenerator,
  ) {}

  async execute(query: GenerateWhatsAppLinkQuery): Promise<string> {
    const invitation = await this.invitationRepository.findById(
      InvitationId.from(query.invitationId),
    );

    if (!invitation) {
      throw new InvitationNotFoundError('Invitation not found');
    }

    const event = await this.eventRepository.findById(
      EventId.from(invitation.eventId),
      query.adminUserId,
    );

    if (!event) {
      throw new EventNotFoundError();
    }

    const message = this.buildMessage(invitation, event);

    return this.whatsAppLinkGenerator.generate({
      phone: invitation.phone.toString(),
      message,
    });
  }

  private buildMessage(invitation: Invitation, event: Event): string {
    const eventDate = new Intl.DateTimeFormat('es-SV', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(event.eventDate);

    return [
      `Hola ${invitation.name} 👋`,
      '',
      `Tenemos el gusto de invitarte a ${event.name}.`,
      '',
      `📅 Fecha: ${eventDate}`,
      `🕐 Hora: ${event.eventTime}`,
      `📍 Lugar: ${event.venue}`,
      '',
      '¡Esperamos contar contigo! 🎉',
    ].join('\n');
  }
}
