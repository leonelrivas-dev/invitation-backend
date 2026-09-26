import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { EventHasInvitationsError } from 'src/modules/events/application/errors/event-has-invitations.error';
import { Event } from 'src/modules/events/domain/entities/event';
import { EventRepository } from 'src/modules/events/domain/repositories/event.repository';
import { EventId } from 'src/modules/events/domain/value-objects/event-id';
import { EventSlug } from 'src/modules/events/domain/value-objects/event-slug';
import { EventMapper } from 'src/modules/events/infrastructure/persistence/prisma/event.mapper';
import { PrismaService } from 'src/shared/infrastructure/database/prisma.service';

@Injectable()
export class PrismaEventRepository implements EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(event: Event): Promise<void> {
    await this.prisma.events.create({
      data: EventMapper.toPersistence(event),
    });
  }

  async update(event: Event): Promise<void> {
    const data = EventMapper.toPersistence(event);

    await this.prisma.events.update({
      where: {
        id: event.id.toString(),
      },
      data: {
        name: data.name,
        event_date: data.event_date,
        event_time: data.event_time,
        venue: data.venue,
        updated_at: data.updated_at,
      },
    });
  }

  async findById(id: EventId, adminUserId: string): Promise<Event | null> {
    const model = await this.prisma.events.findFirst({
      where: {
        id: id.toString(),
        admin_user_id: adminUserId,
      },
    });

    if (!model) {
      return null;
    }

    return EventMapper.toDomain(model);
  }

  async findBySlug(
    slug: EventSlug,
    adminUserId: string,
  ): Promise<Event | null> {
    const model = await this.prisma.events.findFirst({
      where: {
        slug: slug.toString(),
        admin_user_id: adminUserId,
      },
    });

    if (!model) {
      return null;
    }

    return EventMapper.toDomain(model);
  }

  async existsBySlug(slug: EventSlug): Promise<boolean> {
    const model = await this.prisma.events.findUnique({
      where: {
        slug: slug.toString(),
      },
      select: {
        id: true,
      },
    });

    return model !== null;
  }

  async findAll(params: {
    adminUserId: string;
    skip: number;
    take: number;
  }): Promise<{
    items: Event[];
    total: number;
  }> {
    const [models, total] = await Promise.all([
      this.prisma.events.findMany({
        where: {
          admin_user_id: params.adminUserId,
        },
        skip: params.skip,
        take: params.take,
        orderBy: {
          created_at: 'desc',
        },
      }),

      this.prisma.events.count({
        where: {
          admin_user_id: params.adminUserId,
        },
      }),
    ]);

    return {
      items: models.map((model) => EventMapper.toDomain(model)),
      total,
    };
  }

  async delete(id: EventId, adminUserId: string): Promise<void> {
    try {
      await this.prisma.events.delete({
        where: {
          id: id.toString(),
          admin_user_id: adminUserId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      )
        throw new EventHasInvitationsError();

      throw error;
    }
  }
}
