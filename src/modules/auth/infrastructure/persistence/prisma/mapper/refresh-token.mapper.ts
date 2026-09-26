import { admin_refresh_tokens } from 'src/generated/prisma/client';
import { RefreshToken } from 'src/modules/auth/domain/repositories/refresh-token.repository';

export class RefreshTokenMapper {
  static toDomian(model: admin_refresh_tokens): RefreshToken {
    return {
      id: model.id,
      adminUserId: model.admin_user_id,
      tokenHash: model.token_hash,
      expiresAt: model.expires_at,
      revokedAt: model.revoked_at,
      createdAt: model.created_at,
    };
  }
}
