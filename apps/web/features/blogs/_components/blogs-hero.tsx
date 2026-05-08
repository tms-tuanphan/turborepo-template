import type { Messages } from '@/shared/i18n';

type Props = {
  messages: Messages;
};

export function BlogsHero({ messages }: Props) {
  return (
    <section className="px-4 pb-10 pt-12 text-center sm:px-6 lg:pt-20 lg:pb-14">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {messages.blogs.title}
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        {messages.blogs.subtitle}
      </p>
    </section>
  );
}
