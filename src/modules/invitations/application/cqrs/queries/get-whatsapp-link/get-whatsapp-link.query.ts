import { IQuery } from '@nestjs/cqrs';

export class GetWhatsAppLinkQuery implements IQuery {
  constructor(public readonly id: string) {}
}
