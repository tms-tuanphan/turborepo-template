---
name: fe-generate-table
description: Scaffold TanStack Table list UI using shared DataTable patterns. For admin/CMS lists.
---

# Generate table

## Repo pattern

- Reuse `@/shared/components/data-table` when present
- Column defs in `features/<name>/components/<entity>-table-columns.tsx`
- Data: Server Component initial fetch **or** `useQuery` + `getXAction` / service
- Pagination/filters: URL `searchParams` when shareable

## Stack

- TanStack Table + TanStack Query (see [01-architecture.md](../../../docs/01-architecture.md))
- Types from feature `types/` or `@repo/api`

## Files

```
features/<name>/components/
├── <entity>-table.tsx
├── <entity>-table-columns.tsx
└── index.ts
```

## Rules

- [fe-coding-react.mdc](../../../rules/fe-coding-react.mdc) — no fetch in table component body
- [generate-query-hooks](../generate-query-hooks/SKILL.md) if client-side refetch

## Output

Column spec table (id, header key, accessor, sortable?) + file list.
