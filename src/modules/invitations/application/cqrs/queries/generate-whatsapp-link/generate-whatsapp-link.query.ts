import { Query } from '@nestjs/cqrs';

export class GenerateWhatsAppLinkQuery extends Query<string> {
  constructor(
    public readonly invitationId: string,
    public readonly adminUserId: string,
  ) {
    super();
  }
}
