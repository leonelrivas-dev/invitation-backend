export interface WhatsAppLinkGenerator {
  generate(params: { phone: string; message: string }): string;
}
