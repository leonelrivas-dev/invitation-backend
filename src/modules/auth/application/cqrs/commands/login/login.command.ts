import { Command } from '@nestjs/cqrs';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

export class LoginCommand extends Command<LoginResult> {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {
    super();
  }
}
