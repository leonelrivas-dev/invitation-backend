export interface AccessTokenPayload {
  sub: string;
}

export abstract class TokenSigner {
  abstract signAccessToken(payload: AccessTokenPayload): Promise<string>;
  abstract verifyAccessToken(token: string): Promise<AccessTokenPayload>;
}
