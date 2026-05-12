import type { Messages } from '@/shared/i18n';

export type NavItem = {
  labelKey: keyof Messages['nav'];
  href: string;
};

export type HeaderNavEntryId =
  | 'introduction'
  | 'resources'
  | 'products'
  | 'aiDrivenDevelopment';

export type HeaderNavItem =
  | {
      type: 'link';
      id: HeaderNavEntryId;
      labelKey: keyof Messages['nav'];
      href: string;
    }
  | {
      type: 'group';
      id: HeaderNavEntryId;
      labelKey: keyof Messages['nav'];
      items: NavItem[];
    };

export const headerNavItems: HeaderNavItem[] = [
  {
    type: 'link',
    id: 'introduction',
    labelKey: 'introduction',
    href: '#',
  },
  {
    type: 'group',
    id: 'resources',
    labelKey: 'resources',
    items: [
      { labelKey: 'resourceBlogs', href: '/resources/blogs' },
      { labelKey: 'resourceProducts', href: '#' },
    ],
  },
  {
    type: 'link',
    id: 'products',
    labelKey: 'products',
    href: '#',
  },
  {
    type: 'link',
    id: 'aiDrivenDevelopment',
    labelKey: 'aiDrivenDevelopment',
    href: '#',
  },
];
