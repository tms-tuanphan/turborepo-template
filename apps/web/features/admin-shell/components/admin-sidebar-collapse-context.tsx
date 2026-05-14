'use client';

import { createContext, useContext } from 'react';

const AdminSidebarCollapsedContext = createContext(false);

export function AdminSidebarCollapsedProvider({
  value,
  children,
}: {
  value: boolean;
  children: React.ReactNode;
}) {
  return (
    <AdminSidebarCollapsedContext.Provider value={value}>
      {children}
    </AdminSidebarCollapsedContext.Provider>
  );
}

export function useAdminSidebarCollapsed() {
  return useContext(AdminSidebarCollapsedContext);
}
