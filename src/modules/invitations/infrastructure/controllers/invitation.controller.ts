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

import { ConfirmInvitationCommand } from 'src/modules/invitations/application/cqrs/commands/confirm-invitation/confirm-invitation.command';
import { CreateInvitationCommand } from 'src/modules/invitations/application/cqrs/commands/create-invitation/create-invitation.command';
import { DeclineInvitationCommand } from 'src/modules/invitations/application/cqrs/commands/decline-invitation/decline-invitation.command';
import { DeleteInvitationCommand } from 'src/modules/invitations/application/cqrs/commands/delete-invitation/delete-invitation.command';
import { MarkMessageSentCommand } from 'src/modules/invitations/application/cqrs/commands/mark-message-sent/mark-message-sent.command';
import { UpdateInvitationCommand } from 'src/modules/invitations/application/cqrs/commands/update-invitation/update-invitation.command';
import { GenerateWhatsAppLinkQuery } from 'src/modules/invitations/application/cqrs/queries/generate-whatsapp-link/generate-whatsapp-link.query';

import { GetInvitationBySlugQuery } from 'src/modules/invitations/application/cqrs/queries/get-invitation-by-slug/get-invitation-by-slug.query';
import { GetInvitationStatisticsQuery } from 'src/modules/invitations/application/cqrs/queries/get-invitation-statistics/get-invitation-statistics.query';
import { GetInvitationQuery } from 'src/modules/invitations/application/cqrs/queries/get-invitation/get-invitation.query';
import { GetInvitationsQuery } from 'src/modules/invitations/application/cqrs/queries/get-invitations/get-invitations.query';

import { Invitation } from 'src/modules/invitations/domain/entities/invitation';

import { ConfirmInvitationDto } from 'src/modules/invitations/infrastructure/controllers/dto/confirm-invitation.dto';
import { CreateInvitationDto } from 'src/modules/invitations/infrastructure/controllers/dto/create-invitation.dto';
import { InvitationResponseDto } from 'src/modules/invitations/infrastructure/controllers/dto/invitation-response.dto';
import { PublicInvitationResponseDto } from 'src/modules/invitations/infrastructure/controllers/dto/public-invitation-response.dto';
import { UpdateInvitationDto } from 'src/modules/invitations/infrastructure/controllers/dto/update-invitation.dto';

type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

@Controller('invitations')
export class InvitationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // ********* PUBLIC *********

  @Get('slug/:slug')
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<PublicInvitationResponseDto> {
    const invitation = await this.queryBus.execute<Invitation>(
      new GetInvitationBySlugQuery(slug),
    );

    return PublicInvitationResponseDto.fromDomain(invitation);
  }

  @Post('slug/:slug/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirm(
    @Param('slug') slug: string,
    @Body() body: ConfirmInvitationDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new ConfirmInvitationCommand(slug, body.attendees),
    );
  }

  @Post('slug/:slug/decline')
  @HttpCode(HttpStatus.NO_CONTENT)
  async decline(@Param('slug') slug: string): Promise<void> {
    await this.commandBus.execute(new DeclineInvitationCommand(slug));
  }

  // ********* ADMIN *********

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateInvitationDto): Promise<void> {
    await this.commandBus.execute(
      new CreateInvitationCommand(
        body.eventId,
        body.name,
        body.slug,
        body.phone,
        body.allowedSeats,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('statistics')
  async statistics() {
    return this.queryBus.execute(new GetInvitationStatisticsQuery());
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    const result = await this.queryBus.execute(
      new GetInvitationsQuery(Number(page), Number(limit)),
    );

    return {
      items: result.items.map((model) =>
        InvitationResponseDto.fromDomain(model),
      ),
      total: result.total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<InvitationResponseDto> {
    const invitation = await this.queryBus.execute(new GetInvitationQuery(id));

    return InvitationResponseDto.fromDomain(invitation);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: string,
    @Body() body: UpdateInvitationDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateInvitationCommand(id, body.name, body.phone, body.allowedSeats),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteInvitationCommand(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/message-sent')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markMessageSent(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new MarkMessageSentCommand(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/whatsapp-link')
  async generateWhatsAppLink(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<{ url: string }> {
    const url = await this.queryBus.execute<string>(
      new GenerateWhatsAppLinkQuery(id, req.user.id),
    );

    return {
      url,
    };
  }
}
