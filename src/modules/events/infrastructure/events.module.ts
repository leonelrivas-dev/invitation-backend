import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateEventHandler } from 'src/modules/events/application/cqrs/handler/commands/create-event.handler';
import { DeleteEventHandler } from 'src/modules/events/application/cqrs/handler/commands/delete-event.handler';
import { UpdateEventHandler } from 'src/modules/events/application/cqrs/handler/commands/update-event.handler';
import { GetEventByIdHandler } from 'src/modules/events/application/cqrs/handler/queries/get-event-by-id.handler';
import { GetEventBySlugHandler } from 'src/modules/events/application/cqrs/handler/queries/get-event-by-slug.handler';
import { GetEventsHandler } from 'src/modules/events/application/cqrs/handler/queries/get-events.handler';
import { EventRepository } from 'src/modules/events/domain/repositories/event.repository';
import { EventController } from 'src/modules/events/infrastructure/controllers/event.controller';
import { PrismaEventRepository } from 'src/modules/events/infrastructure/persistence/prisma/prisma-event.repository';

@Module({
  imports: [CqrsModule],

  controllers: [EventController],

  providers: [
    CreateEventHandler,
    GetEventsHandler,
    GetEventByIdHandler,
    GetEventBySlugHandler,
    UpdateEventHandler,
    DeleteEventHandler,

    {
      provide: EventRepository,
      useClass: PrismaEventRepository,
    },
  ],

  exports: [EventRepository],
})
export class EventsModule {}
