import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { AuthenticatedUser } from 'src/modules/auth/infrastructure/security/jwt.strategy';
import { CreateEventCommand } from 'src/modules/events/application/cqrs/commands/create-event/create-event.command';
import { DeleteEventCommand } from 'src/modules/events/application/cqrs/commands/delete-event/delete-event.command';
import { UpdateEventCommand } from 'src/modules/events/application/cqrs/commands/update-event/update-event.command';
import { GetEventsByIdQuery } from 'src/modules/events/application/cqrs/queries/get-event-by-id/get-event-by-id.query';
import { GetEventBySlugQuery } from 'src/modules/events/application/cqrs/queries/get-event-by-slug/get-event-by-slug.query';
import {
  GetEventsQuery,
  GetEventsResult,
} from 'src/modules/events/application/cqrs/queries/get-events/get-events.query';
import { Event } from 'src/modules/events/domain/entities/event';
import { CreateEventDto } from 'src/modules/events/infrastructure/controllers/dto/create-event.dto';
import { EventResponseDto } from 'src/modules/events/infrastructure/controllers/dto/event-response.dto';
import { UpdateEventDto } from 'src/modules/events/infrastructure/controllers/dto/update-event.dto';

type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

@Controller('events')
export class EventController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateEventDto,
  ): Promise<void> {
    console.log('Crear evento');
    await this.commandBus.execute(
      new CreateEventCommand(
        req.user.id,
        body.name,
        body.slug,
        new Date(body.eventDate),
        body.eventTime,
        body.venue,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const currentPage = Number(page);
    const currentLimit = Number(limit);

    const result = await this.queryBus.execute<GetEventsResult>(
      new GetEventsQuery(req.user.id, currentPage, currentLimit),
    );

    return {
      items: result.items.map((event) => EventResponseDto.fromDomain(event)),
      total: result.total,
      page: currentPage,
      limit: currentLimit,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<EventResponseDto> {
    const event = await this.queryBus.execute<Event>(
      new GetEventsByIdQuery(id, req.user.id),
    );

    return EventResponseDto.fromDomain(event);
  }

  @UseGuards(JwtAuthGuard)
  @Get('slug/:slug')
  async findBySlug(
    @Req() req: AuthenticatedRequest,
    @Param('slug') slug: string,
  ): Promise<EventResponseDto> {
    const event = await this.queryBus.execute<Event>(
      new GetEventBySlugQuery(slug, req.user.id),
    );

    return EventResponseDto.fromDomain(event);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateEventDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateEventCommand(
        id,
        req.user.id,
        body.name,
        new Date(body.eventDate),
        body.eventTime,
        body.venue,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteEventCommand(id, req.user.id));
  }
}
