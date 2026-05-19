'use client';

import { Settings2Icon } from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type AdminBlogEditorLayoutProps = {
  editor: ReactNode;
  sidebar: ReactNode;
  mobilePublishBar?: ReactNode;
  settingsLabel: string;
  className?: string;
};

export function AdminBlogEditorLayout({
  editor,
  sidebar,
  mobilePublishBar,
  settingsLabel,
  className,
}: AdminBlogEditorLayoutProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          'mx-auto w-full flex-1 px-4 py-4 sm:px-6 sm:py-5',
          className,
        )}
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start xl:gap-8">
          <div className="min-w-0">
            <div className="mx-auto flex w-full flex-col gap-3">{editor}</div>
            <div className="mt-3 flex justify-end xl:hidden">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Settings2Icon className="size-4" aria-hidden />
                    {settingsLabel}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full overflow-y-auto sm:max-w-md"
                >
                  <SheetHeader>
                    <SheetTitle>{settingsLabel}</SheetTitle>
                    <SheetDescription className="sr-only">
                      {settingsLabel}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-4 pb-8">{sidebar}</div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <aside className="hidden w-80 shrink-0 xl:block">{sidebar}</aside>
        </div>
      </div>
      {mobilePublishBar}
    </>
  );
}
