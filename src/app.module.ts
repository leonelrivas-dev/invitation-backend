import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from 'src/modules/auth/infrastructure/auth.module';
import { EventsModule } from 'src/modules/events/infrastructure/events.module';
import { InvitationsModule } from 'src/modules/invitations/infrastructure/invitations.module';
import { PrismaModule } from 'src/shared/infrastructure/database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CqrsModule,
    InvitationsModule,
    EventsModule,
    AuthModule,
  ],
})
export class AppModule {}
