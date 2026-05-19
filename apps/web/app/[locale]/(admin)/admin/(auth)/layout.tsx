type AdminAuthLayoutProps = {
  children: React.ReactNode;
};

export default function AdminAuthLayout({ children }: AdminAuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 px-4 py-12">
      {children}
    </div>
  );
}
