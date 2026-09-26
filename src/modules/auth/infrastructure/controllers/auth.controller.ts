import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  LoginCommand,
  LoginResult,
} from 'src/modules/auth/application/cqrs/commands/login/login.command';
import { LogoutCommand } from 'src/modules/auth/application/cqrs/commands/logout/logout.command';
import {
  RefreshTokenCommand,
  RefreshTokenResult,
} from 'src/modules/auth/application/cqrs/commands/refresh-token/refresh-token.command';
import { LoginResponseDto } from 'src/modules/auth/infrastructure/controllers/dtos/login-response.dto';
import { LoginDto } from 'src/modules/auth/infrastructure/controllers/dtos/login.dto';
import { LogoutDto } from 'src/modules/auth/infrastructure/controllers/dtos/logout.dto';
import { RefreshTokenDto } from 'src/modules/auth/infrastructure/controllers/dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    const result = await this.commandBus.execute<LoginCommand, LoginResult>(
      new LoginCommand(body.email, body.password),
    );

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Post('logout')
  async logout(@Body() body: LogoutDto) {
    await this.commandBus.execute(new LogoutCommand(body.refreshToken));
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDto): Promise<LoginResponseDto> {
    const result = await this.commandBus.execute<
      RefreshTokenCommand,
      RefreshTokenResult
    >(new RefreshTokenCommand(body.refreshToken));

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }
}
