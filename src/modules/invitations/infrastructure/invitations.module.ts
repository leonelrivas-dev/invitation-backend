import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventsModule } from 'src/modules/events/infrastructure/events.module';
import { ConfirmInvitationHandler } from 'src/modules/invitations/application/cqrs/handlers/commands/confirm-invitation.handler';
import { CreateInvitationHandler } from 'src/modules/invitations/application/cqrs/handlers/commands/create-invitation.handler';
import { DeclineInvitationHandler } from 'src/modules/invitations/application/cqrs/handlers/commands/decline-invitation.handler';
import { DeleteInvitationHandler } from 'src/modules/invitations/application/cqrs/handlers/commands/delete-invitation.handler';
import { MarkMessageSentHandle } from 'src/modules/invitations/application/cqrs/handlers/commands/mark-message-sent.handle';
import { UpdateInvitationHandler } from 'src/modules/invitations/application/cqrs/handlers/commands/update-invitation.handler';
import { GetInvitationBySlugHandler } from 'src/modules/invitations/application/cqrs/handlers/queries/get-invitation-by-slug.handler';
import { GetInvitationStatisticsHandler } from 'src/modules/invitations/application/cqrs/handlers/queries/get-invitation-statistics.handler';
import { GetInvitationHandler } from 'src/modules/invitations/application/cqrs/handlers/queries/get-invitation.handler';
import { GetInvitationsHandler } from 'src/modules/invitations/application/cqrs/handlers/queries/get-invitations.handler';
import { InvitationRepository } from 'src/modules/invitations/domain/repositories/invitation.repository';
import { InvitationController } from 'src/modules/invitations/infrastructure/controllers/invitation.controller';
import { PrismaInvitationRepository } from 'src/modules/invitations/infrastructure/persistence/prisma/prisma-invitation.repository';
import { WhatsAppLinkGeneratorAdapter } from 'src/modules/invitations/infrastructure/whatsapp/whatsapp-link-generator.adapter';
import { GenerateWhatsAppLinkHandler } from 'src/modules/invitations/application/cqrs/handlers/queries/generate-whatsapp-link.handler';
import { WHATSAPP_LINK_GENERATOR } from 'src/modules/invitations/application/ports/whatsapp-link-generator.token';

@Module({
  imports: [CqrsModule, EventsModule],

  controllers: [InvitationController],

  providers: [
    // * Commands
    CreateInvitationHandler,
    UpdateInvitationHandler,
    DeleteInvitationHandler,
    ConfirmInvitationHandler,
    DeclineInvitationHandler,
    MarkMessageSentHandle,

    // * Queries
    GetInvitationHandler,
    GetInvitationBySlugHandler,
    GetInvitationsHandler,
    GetInvitationStatisticsHandler,

    GenerateWhatsAppLinkHandler,

    {
      provide: InvitationRepository,
      useClass: PrismaInvitationRepository,
    },

    {
      provide: WHATSAPP_LINK_GENERATOR,
      useClass: WhatsAppLinkGeneratorAdapter,
    },
  ],

  exports: [InvitationRepository],
})
export class InvitationsModule {}
