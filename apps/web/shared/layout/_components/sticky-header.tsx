'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
  scrolledClassName?: string;
  thresholdPx?: number;
};

export function StickyHeader({
  children,
  className,
  scrolledClassName,
  thresholdPx = 0,
}: Props) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      setIsScrolled(window.scrollY > thresholdPx);
    };

    const onScroll = () => {
      if (rafId != null) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (rafId != null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, [thresholdPx]);

  return (
    <header className={cn(className, isScrolled && scrolledClassName)}>
      {children}
    </header>
  );
}
