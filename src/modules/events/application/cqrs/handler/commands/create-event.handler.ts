import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEventCommand } from 'src/modules/events/application/cqrs/commands/create-event/create-event.command';
import { Event } from 'src/modules/events/domain/entities/event';
import { EventRepository } from 'src/modules/events/domain/repositories/event.repository';
import { EventSlug } from 'src/modules/events/domain/value-objects/event-slug';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand> {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(command: CreateEventCommand): Promise<void> {
    const slug = EventSlug.create(command.slug);

    const exists = await this.eventRepository.existsBySlug(slug);

    if (exists) {
      throw new Error('Event slug already exists');
    }

    const event = Event.create({
      adminUserId: command.adminUserId,
      name: command.name,
      slug,
      eventDate: command.eventDate,
      eventTime: command.eventTime,
      venue: command.venue,
    });

    await this.eventRepository.save(event);
  }
}
