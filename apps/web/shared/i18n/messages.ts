import enMessages from '@/messages/en.json';
import jaMessages from '@/messages/ja.json';
import viMessages from '@/messages/vi.json';

import type { Locale } from './locale';

export type Messages = typeof enMessages;

const dictionaries: Record<Locale, Messages> = {
  en: enMessages,
  ja: jaMessages as Messages,
  vi: viMessages,
};

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}
