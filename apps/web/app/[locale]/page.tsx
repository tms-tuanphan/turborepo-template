import { redirect } from 'next/navigation';

type Params = Promise<{ locale: string }>;

export default async function LocaleRootPage({ params }: { params: Params }) {
  const { locale } = await params;
  redirect(`/${locale}/resources/blogs`);
}
