import { z } from 'zod';

import {
  ADMIN_FILTER_STATUSES,
  type AdminBlogFilters,
  type AdminFilterStatus,
} from '../types/admin-blog';

const filtersSchema = z.object({
  search: z.string().trim().max(120).default(''),
  category: z.string().default('ALL'),
  status: z.enum(ADMIN_FILTER_STATUSES).default('ALL'),
  pageNo: z.coerce.number().int().min(1).max(999).default(1),
});

export type RawSearchParams = Record<string, string | string[] | undefined>;

function pickFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/** Maps legacy URL status values to API filter status. */
function normalizeStatus(raw: string): AdminFilterStatus {
  if (raw === 'DRAFT') return 'UNPUBLISHED';
  if (raw === 'ARCHIVED' || raw === 'REVIEWING' || raw === 'SCHEDULED') {
    return 'ALL';
  }
  if ((ADMIN_FILTER_STATUSES as readonly string[]).includes(raw)) {
    return raw as AdminFilterStatus;
  }
  return 'ALL';
}

export function parseAdminBlogFilters(params: RawSearchParams): AdminBlogFilters {
  const parsed = filtersSchema.safeParse({
    search: pickFirst(params.search) ?? '',
    category: pickFirst(params.category) ?? 'ALL',
    status: normalizeStatus(pickFirst(params.status) ?? 'ALL'),
    pageNo: pickFirst(params.pageNo) ?? '1',
  });

  if (!parsed.success) {
    return { search: '', category: 'ALL', status: 'ALL', page: 1 };
  }

  return {
    search: parsed.data.search,
    category: parsed.data.category,
    status: parsed.data.status,
    page: parsed.data.pageNo,
  };
}
