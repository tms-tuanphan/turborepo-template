'use client';

import { Check, ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  localeFlags,
  locales,
  type Locale,
  type Messages,
} from '@/shared/i18n';

const localeMenuOrder: Locale[] = ['vi', 'en', 'ja'];

type Props = {
  locale: Locale;
  messages: Messages;
};

export function LanguageSwitcher({ locale, messages }: Props) {
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
          className="group gap-2 text-base! font-medium"
          aria-label={messages.language.switcherLabel}
        >
          <span className="text-lg leading-none" aria-hidden>
            {localeFlags[locale]}
          </span>
          <span>{messages.language.option[locale]}</span>
          <ChevronDown
            className="size-4 shrink-0 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44 text-base!">
        {localeMenuOrder.map((value) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => handleSelect(value)}
            className="justify-between gap-3 text-base!"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg leading-none" aria-hidden>
                {localeFlags[value]}
              </span>
              <span>{messages.language.option[value]}</span>
            </span>
            <Check
              className={cn(
                'size-4.5 shrink-0',
                value === locale ? 'opacity-100' : 'opacity-0',
              )}
              aria-hidden
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
