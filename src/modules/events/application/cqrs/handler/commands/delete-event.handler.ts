import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteEventCommand } from 'src/modules/events/application/cqrs/commands/delete-event/delete-event.command';
import { EventNotFoundError } from 'src/modules/events/domain/errors/event-not-found.error';
import { EventRepository } from 'src/modules/events/domain/repositories/event.repository';
import { EventId } from 'src/modules/events/domain/value-objects/event-id';

@CommandHandler(DeleteEventCommand)
export class DeleteEventHandler implements ICommandHandler<DeleteEventCommand> {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(command: DeleteEventCommand): Promise<void> {
    const event = await this.eventRepository.findById(
      EventId.from(command.id),
      command.adminUserId,
    );

    if (!event) {
      throw new EventNotFoundError();
    }

    await this.eventRepository.delete(event.id, command.adminUserId);
  }
}
