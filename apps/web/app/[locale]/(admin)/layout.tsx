type Params = Promise<{ locale: string }>;

export default async function AdminShellLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  await params;

  return <div className="flex min-h-svh flex-col bg-muted/30">{children}</div>;
}
