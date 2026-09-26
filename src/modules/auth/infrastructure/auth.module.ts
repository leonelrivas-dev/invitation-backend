import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoginHandler } from 'src/modules/auth/application/cqrs/handlers/commands/login.handler';
import { LogoutHandler } from 'src/modules/auth/application/cqrs/handlers/commands/logout.handler';
import { RefreshTokenHandler } from 'src/modules/auth/application/cqrs/handlers/commands/refresh-token.handler';
import { PasswordHasher } from 'src/modules/auth/application/ports/password-hasher';
import { RefreshTokenGenerator } from 'src/modules/auth/application/ports/refresh-token-generator';
import { TokenSigner } from 'src/modules/auth/application/ports/token-signer';
import { AdminUserRepository } from 'src/modules/auth/domain/repositories/admin-user.repository';
import { RefreshTokenRepository } from 'src/modules/auth/domain/repositories/refresh-token.repository';
import { AuthController } from 'src/modules/auth/infrastructure/controllers/auth.controller';
import { PrismaAdminUserRepository } from 'src/modules/auth/infrastructure/persistence/prisma/prisma-admin-user.repository';
import { PrismaRefreshTokenRepository } from 'src/modules/auth/infrastructure/persistence/prisma/prisma-refresh-token.repository';
import { BcryptPasswordHasher } from 'src/modules/auth/infrastructure/security/bcrypt-password-hasher';
import { CryptoRefreshTokenGenerator } from 'src/modules/auth/infrastructure/security/crypto-refresh-token-generator';
import { JwtTokenSigner } from 'src/modules/auth/infrastructure/security/jwt-token-signer';
import { JwtStrategy } from 'src/modules/auth/infrastructure/security/jwt.strategy';
import { PrismaService } from 'src/shared/infrastructure/database/prisma.service';

@Module({
  imports: [
    CqrsModule,

    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    PrismaService,
    LoginHandler,
    LogoutHandler,
    RefreshTokenHandler,
    JwtStrategy,
    {
      provide: PasswordHasher,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: TokenSigner,
      useClass: JwtTokenSigner,
    },
    {
      provide: RefreshTokenGenerator,
      useClass: CryptoRefreshTokenGenerator,
    },
    {
      provide: AdminUserRepository,
      useClass: PrismaAdminUserRepository,
    },
    {
      provide: RefreshTokenRepository,
      useClass: PrismaRefreshTokenRepository,
    },
  ],
})
export class AuthModule {}
