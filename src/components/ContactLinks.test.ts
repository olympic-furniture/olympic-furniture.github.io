import { expect, it } from 'vitest';
import { whatsappHref } from './ContactLinks';

it.each([
  ['050-123-4567', 'https://wa.me/972501234567'],
  ['+972 50-123-4567', 'https://wa.me/972501234567'],
])(
  'builds a WhatsApp destination from confirmed phone %s',
  (phone, expected) => {
    expect(whatsappHref(phone)).toBe(expected);
  },
);
