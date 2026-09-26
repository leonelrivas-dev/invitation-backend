import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateEventCommand } from 'src/modules/events/application/cqrs/commands/update-event/update-event.command';
import { EventNotFoundError } from 'src/modules/events/domain/errors/event-not-found.error';
import { EventRepository } from 'src/modules/events/domain/repositories/event.repository';
import { EventId } from 'src/modules/events/domain/value-objects/event-id';

@CommandHandler(UpdateEventCommand)
export class UpdateEventHandler implements ICommandHandler<UpdateEventCommand> {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(command: UpdateEventCommand): Promise<void> {
    console.log('UPDATE EVENT COMMAND', command);
    const event = await this.eventRepository.findById(
      EventId.from(command.id),
      command.adminUserId,
    );

    if (!event) {
      throw new EventNotFoundError();
    }

    event.update({
      name: command.name,
      eventDate: command.eventDate,
      eventTime: command.eventTime,
      venue: command.venue,
    });

    console.log('Before update event', event);

    await this.eventRepository.update(event);

    console.log('Event updated successfully');
  }
}
