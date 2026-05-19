type Params = Promise<{ locale: string }>;

export default async function AdminShellLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  await params;

  return children;
}
