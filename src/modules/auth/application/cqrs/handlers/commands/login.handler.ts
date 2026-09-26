import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import {
  LoginCommand,
  LoginResult,
} from 'src/modules/auth/application/cqrs/commands/login/login.command';
import { InvalidCredentialsError } from 'src/modules/auth/application/errors/invalid-credentials.error';
import { PasswordHasher } from 'src/modules/auth/application/ports/password-hasher';
import { RefreshTokenGenerator } from 'src/modules/auth/application/ports/refresh-token-generator';
import { TokenSigner } from 'src/modules/auth/application/ports/token-signer';
import { AdminUserRepository } from 'src/modules/auth/domain/repositories/admin-user.repository';
import { RefreshTokenRepository } from 'src/modules/auth/domain/repositories/refresh-token.repository';
import { Email } from 'src/modules/auth/domain/value-objects/email';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<
  LoginCommand,
  LoginResult
> {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenSigner: TokenSigner,
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const email = Email.from(command.email);
    const adminUser = await this.adminUserRepository.findByEmail(email);

    if (!adminUser) throw new InvalidCredentialsError();

    const passwordValid = await this.passwordHasher.compare(
      command.password,
      adminUser.passwordHash,
    );

    if (!passwordValid) throw new InvalidCredentialsError();

    const accessToken = await this.tokenSigner.signAccessToken({
      sub: adminUser.id.toString(),
    });

    const refreshToken = this.refreshTokenGenerator.generate();

    const tokenHash = this.refreshTokenGenerator.hash(refreshToken);

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    await this.refreshTokenRepository.save({
      id: randomUUID(),
      adminUserId: adminUser.id.toString(),
      tokenHash,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
