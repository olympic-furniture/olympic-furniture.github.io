import { site } from '../content';
export const phoneHref = `tel:${site.phone.replace(/[^+\d]/g, '')}`;
export const externalLink = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;
export function whatsappHref(phone: string) {
  return `https://wa.me/972${phone.replace(/\D/g, '').replace(/^(?:972|0)/, '')}`;
}
