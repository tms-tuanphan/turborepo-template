type Params = Promise<{ locale: string }>;

export default async function AdminShellLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  await params;

  return (
    <div className="min-h-svh bg-muted/30">
      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-4 py-8 sm:px-6">
        {children}
      </div>
    </div>
  );
}
