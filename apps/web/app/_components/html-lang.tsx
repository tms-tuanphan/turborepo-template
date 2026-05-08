'use client';

import { useEffect } from 'react';

import type { Locale } from '@/shared/i18n';

type Props = {
  locale: Locale;
};

export function HtmlLang({ locale }: Props) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  return null;
}
