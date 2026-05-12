export const locales = ['en', 'ja', 'vi'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'vi';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  ja: 'JA',
  vi: 'VI',
};

/** Decorative flag emoji per locale; pair with `language.option` in messages for screen readers. */
export const localeFlags: Record<Locale, string> = {
  en: '\u{1F1EC}\u{1F1E7}',
  ja: '\u{1F1EF}\u{1F1F5}',
  vi: '\u{1F1FB}\u{1F1F3}',
};
