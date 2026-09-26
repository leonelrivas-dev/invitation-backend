export interface RefreshToken {
  id: string;
  adminUserId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

export abstract class RefreshTokenRepository {
  abstract save(params: {
    id: string;
    adminUserId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void>;

  abstract findByHash(tokenHash: string): Promise<RefreshToken | null>;

  abstract revoke(id: string): Promise<void>;
}
