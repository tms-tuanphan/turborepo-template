type AdminSidebarProps = {
  brand: string;
  navLabel: string;
  children: React.ReactNode;
};

export function AdminSidebar({ brand, navLabel, children }: AdminSidebarProps) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-card md:flex">
      <div className="flex h-16 shrink-0 items-center border-b px-4">
        <span className="text-sm font-semibold tracking-tight">{brand}</span>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto p-3" aria-label={navLabel}>
        {children}
      </nav>
    </aside>
  );
}
