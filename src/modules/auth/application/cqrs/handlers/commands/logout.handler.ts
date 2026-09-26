import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from 'src/modules/auth/application/cqrs/commands/logout/logout.command';
import { RefreshTokenGenerator } from 'src/modules/auth/application/ports/refresh-token-generator';
import { RefreshTokenRepository } from 'src/modules/auth/domain/repositories/refresh-token.repository';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand, void> {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    const tokenHash = this.refreshTokenGenerator.hash(command.refreshToken);

    const refreshToken =
      await this.refreshTokenRepository.findByHash(tokenHash);

    if (!refreshToken) {
      return;
    }

    if (refreshToken.revokedAt) {
      return;
    }

    await this.refreshTokenRepository.revoke(refreshToken.id);
  }
}
