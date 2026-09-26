import { Injectable } from '@nestjs/common';
import {
  RefreshToken,
  RefreshTokenRepository,
} from 'src/modules/auth/domain/repositories/refresh-token.repository';
import { RefreshTokenMapper } from 'src/modules/auth/infrastructure/persistence/prisma/mapper/refresh-token.mapper';
import { PrismaService } from 'src/shared/infrastructure/database/prisma.service';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(params: {
    id: string;
    adminUserId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.prisma.admin_refresh_tokens.create({
      data: {
        id: params.id,
        admin_user_id: params.adminUserId,
        token_hash: params.tokenHash,
        expires_at: params.expiresAt,
      },
    });
  }

  async findByHash(tokenHash: string): Promise<RefreshToken | null> {
    const model = await this.prisma.admin_refresh_tokens.findUnique({
      where: {
        token_hash: tokenHash,
      },
    });

    if (!model) return null;

    return RefreshTokenMapper.toDomian(model);
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.admin_refresh_tokens.update({
      where: {
        id,
      },
      data: {
        revoked_at: new Date(),
      },
    });
  }
}
