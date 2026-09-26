import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import {
  RefreshTokenCommand,
  RefreshTokenResult,
} from 'src/modules/auth/application/cqrs/commands/refresh-token/refresh-token.command';
import { InvalidRefreshTokenError } from 'src/modules/auth/application/errors/invalid-refresh-token.error';
import { RefreshTokenGenerator } from 'src/modules/auth/application/ports/refresh-token-generator';
import { TokenSigner } from 'src/modules/auth/application/ports/token-signer';
import { AdminUserRepository } from 'src/modules/auth/domain/repositories/admin-user.repository';
import { RefreshTokenRepository } from 'src/modules/auth/domain/repositories/refresh-token.repository';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<
  RefreshTokenCommand,
  RefreshTokenResult
> {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly adminUserRepository: AdminUserRepository,
    private readonly tokenSigner: TokenSigner,
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    const tokenHash = this.refreshTokenGenerator.hash(command.refreshToken);

    const storedToken = await this.refreshTokenRepository.findByHash(tokenHash);

    if (!storedToken) {
      throw new InvalidRefreshTokenError();
    }

    if (storedToken.revokedAt) {
      throw new InvalidRefreshTokenError();
    }

    if (storedToken.expiresAt <= new Date()) {
      throw new InvalidRefreshTokenError();
    }

    const adminUser = await this.adminUserRepository.findById(
      storedToken.adminUserId,
    );

    if (!adminUser) {
      throw new InvalidRefreshTokenError();
    }

    await this.refreshTokenRepository.revoke(storedToken.id);

    const accessToken = await this.tokenSigner.signAccessToken({
      sub: adminUser.id.toString(),
    });

    const refreshToken = this.refreshTokenGenerator.generate();

    const newTokenHash = this.refreshTokenGenerator.hash(refreshToken);

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    await this.refreshTokenRepository.save({
      id: randomUUID(),
      adminUserId: adminUser.id.toString(),
      tokenHash: newTokenHash,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
