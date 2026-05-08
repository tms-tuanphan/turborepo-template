'use client';

import { Check, Globe } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { localeLabels, locales, type Locale } from '@/shared/i18n';

type Props = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = (next: Locale) => {
    if (next === locale) return;
    const segments = pathname.split('/');
    if (segments[1] && (locales as readonly string[]).includes(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const basePath = segments.join('/') || `/${next}`;
    const query = searchParams.toString();
    const target = query ? `${basePath}?${query}` : basePath;
    router.push(target);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 font-medium"
          aria-label="Change language"
        >
          <Globe className="size-4" />
          {localeLabels[locale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[8rem]">
        {locales.map((value) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => handleSelect(value)}
            className="justify-between"
          >
            <span>{localeLabels[value]}</span>
            <Check
              className={cn(
                'size-4',
                value === locale ? 'opacity-100' : 'opacity-0',
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
