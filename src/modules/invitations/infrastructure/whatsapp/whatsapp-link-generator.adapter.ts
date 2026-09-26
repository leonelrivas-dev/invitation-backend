import { Injectable } from '@nestjs/common';
import { WhatsAppLinkGenerator } from 'src/modules/invitations/application/ports/whatsapp-link-generator';

@Injectable()
export class WhatsAppLinkGeneratorAdapter implements WhatsAppLinkGenerator {
  generate(params: { phone: string; message: string }): string {
    const phone = params.phone.replace(/\D/g, '');

    const message = encodeURIComponent(params.message);

    return `https://wa.me/${phone}?text=${message}`;
  }
}
