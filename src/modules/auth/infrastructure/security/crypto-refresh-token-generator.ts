import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { RefreshTokenGenerator } from 'src/modules/auth/application/ports/refresh-token-generator';

@Injectable()
export class CryptoRefreshTokenGenerator implements RefreshTokenGenerator {
  generate(): string {
    return randomBytes(64).toString('hex');
  }

  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
