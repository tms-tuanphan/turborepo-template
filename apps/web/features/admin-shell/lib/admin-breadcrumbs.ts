import type { Messages } from '@/shared/i18n';

export type AdminBreadcrumbItem = {
  label: string;
};

type SectionResolver = (
  messages: Messages,
  segments: string[],
) => AdminBreadcrumbItem[] | null;

const SECTION_RESOLVERS: Record<string, SectionResolver> = {
  blogs: (messages, segments) => {
    const items: AdminBreadcrumbItem[] = [
      { label: messages.admin.blogs.pageTitle },
    ];
    const [, maybeId, maybeAction] = segments;
    if (maybeId === 'new') {
      items.push({ label: messages.admin.blogs.newPageTitle });
    } else if (maybeAction === 'edit') {
      items.push({ label: messages.admin.blogs.editPageTitle });
    }
    return items;
  },
  'blog-categories': (messages) => [
    { label: messages.admin.blogCategories.pageTitle },
  ],
};

export function getAdminBreadcrumbItems(
  pathname: string,
  messages: Messages,
): AdminBreadcrumbItem[] {
  const tShell = messages.admin.shell;
  const segments = pathname.split('/').filter(Boolean);
  const adminIndex = segments.indexOf('admin');
  if (adminIndex === -1) {
    return [{ label: tShell.brand }];
  }

  const afterAdmin = segments.slice(adminIndex + 1);
  const items: AdminBreadcrumbItem[] = [{ label: tShell.brand }];

  const [section, ...rest] = afterAdmin;
  if (!section) {
    return items;
  }

  const resolver = SECTION_RESOLVERS[section];
  if (resolver) {
    const sectionItems = resolver(messages, [section, ...rest]);
    if (sectionItems) {
      items.push(...sectionItems);
    }
    return items;
  }

  return items;
}
