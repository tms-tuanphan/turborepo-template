import type { Messages } from '@/shared/i18n';

export type NavGroupId = 'about' | 'services' | 'resources' | 'ourWorks';

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

export type NavGroup = {
  id: NavGroupId;
  labelKey: keyof Messages['nav'];
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    id: 'about',
    labelKey: 'about',
    items: [
      { labelKey: 'leadership', href: '#' },
      { labelKey: 'aboutUs', href: '#' },
    ],
  },
  {
    id: 'services',
    labelKey: 'services',
    items: [
      { labelKey: 'comprehensiveSoftware', href: '#' },
      { labelKey: 'aiDataScience', href: '#' },
      { labelKey: 'cloudDevops', href: '#' },
      { labelKey: 'adaptiveHiring', href: '#' },
    ],
  },
  {
    id: 'resources',
    labelKey: 'resources',
    items: [
      { labelKey: 'uiUxResources', href: '#' },
      { labelKey: 'modules', href: '#' },
      { labelKey: 'documentations', href: '#' },
      { labelKey: 'blog', href: '/resources/blogs' },
      { labelKey: 'eventWebinar', href: '#' },
    ],
  },
  {
    id: 'ourWorks',
    labelKey: 'ourWorks',
    items: [
      { labelKey: 'developmentPortfolio', href: '#' },
      { labelKey: 'demos', href: '#' },
      { labelKey: 'webApp', href: '#' },
      { labelKey: 'modernizedSystem', href: '#' },
      { labelKey: 'aiData', href: '#' },
    ],
  },
];

export type FooterColumnId = 'about' | 'services' | 'ourWorks' | 'resources';

export const footerColumns: { id: FooterColumnId; group: NavGroupId }[] = [
  { id: 'about', group: 'about' },
  { id: 'services', group: 'services' },
  { id: 'ourWorks', group: 'ourWorks' },
  { id: 'resources', group: 'resources' },
];
