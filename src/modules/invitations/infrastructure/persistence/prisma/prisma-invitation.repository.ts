import { Injectable } from '@nestjs/common';
import { Invitation } from 'src/modules/invitations/domain/entities/invitation';
import { InvitationRepository } from 'src/modules/invitations/domain/repositories/invitation.repository';
import { InvitationId } from 'src/modules/invitations/domain/value-objects/invitation-id';
import { InvitationSlug } from 'src/modules/invitations/domain/value-objects/invitation-slug';
import { InvitationMapper } from 'src/modules/invitations/infrastructure/persistence/prisma/invitation.mapper';
import { PrismaService } from 'src/shared/infrastructure/database/prisma.service';

@Injectable()
export class PrismaInvitationRepository implements InvitationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(invitation: Invitation): Promise<void> {
    await this.prisma.invitations.create({
      data: {
        id: invitation.id.toString(),
        event_id: invitation.eventId,
        name: invitation.name,
        slug: invitation.slug.toString(),
        phone: invitation.phone.toString(),
        allowed_seats: invitation.allowedSeats,
        confirmed_seats: invitation.confirmedSeats,
        status: invitation.status,
        message_sent_at: invitation.messageSentAt,
        created_at: invitation.createdAt,
        updated_at: invitation.updatedAt,
      },
    });
  }

  async update(invitation: Invitation): Promise<void> {
    await this.prisma.invitations.update({
      where: {
        id: invitation.id.toString(),
      },
      data: {
        name: invitation.name,
        phone: invitation.phone.toString(),
        allowed_seats: invitation.allowedSeats,
        confirmed_seats: invitation.confirmedSeats,
        status: invitation.status,
        message_sent_at: invitation.messageSentAt,
        updated_at: invitation.updatedAt,
      },
    });
  }

  async findAll(params: { skip: number; take: number }): Promise<{
    items: Invitation[];
    total: number;
  }> {
    const [models, total] = await Promise.all([
      this.prisma.invitations.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.invitations.count(),
    ]);

    return {
      items: models.map((model) => InvitationMapper.toDomain(model)),
      total,
    };
  }

  async findById(id: InvitationId): Promise<Invitation | null> {
    const model = await this.prisma.invitations.findUnique({
      where: {
        id: id.toString(),
      },
    });

    if (!model) return null;

    return InvitationMapper.toDomain(model);
  }

  async findBySlug(slug: InvitationSlug): Promise<Invitation | null> {
    const model = await this.prisma.invitations.findUnique({
      where: {
        slug: slug.toString(),
      },
    });

    if (!model) return null;

    return InvitationMapper.toDomain(model);
  }

  async getStatistics(): Promise<{
    totalInvitations: number;
    pendingInvitations: number;
    confirmedInvitations: number;
    declinedInvitations: number;
    totalAllowedSeats: number;
    totalConfirmedSeats: number;
  }> {
    const [
      totalInvitations,
      pendingInvitations,
      confirmedInvitations,
      declinedInvitations,
      seats,
    ] = await Promise.all([
      this.prisma.invitations.count(),

      this.prisma.invitations.count({
        where: {
          status: 'PENDING',
        },
      }),

      this.prisma.invitations.count({
        where: {
          status: 'CONFIRMED',
        },
      }),

      this.prisma.invitations.count({
        where: {
          status: 'DECLINED',
        },
      }),

      this.prisma.invitations.aggregate({
        _sum: {
          allowed_seats: true,
          confirmed_seats: true,
        },
      }),
    ]);

    return {
      totalInvitations,
      pendingInvitations,
      confirmedInvitations,
      declinedInvitations,
      totalAllowedSeats: seats._sum.allowed_seats ?? 0,
      totalConfirmedSeats: seats._sum.confirmed_seats ?? 0,
    };
  }

  async existsBySlug(slug: InvitationSlug): Promise<boolean> {
    const invitation = await this.prisma.invitations.findUnique({
      where: {
        slug: slug.toString(),
      },
      select: {
        id: true,
      },
    });

    return invitation !== null;
  }

  async delete(id: InvitationId): Promise<void> {
    await this.prisma.invitations.delete({
      where: {
        id: id.toString(),
      },
    });
  }
}
