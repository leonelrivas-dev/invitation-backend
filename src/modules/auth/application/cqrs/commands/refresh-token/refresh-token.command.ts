import { Command } from '@nestjs/cqrs';

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenCommand extends Command<RefreshTokenResult> {
  constructor(public readonly refreshToken: string) {
    super();
  }
}
