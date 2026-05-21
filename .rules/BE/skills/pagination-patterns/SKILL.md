---
name: be-pagination-patterns
description: Shared page/pageSize contract and parse helpers for Nest list APIs. Use when adding or changing paginated endpoints (blogs, future CMS lists).
---

# Pagination patterns (BE)

> Contract: `packages/api/src/common/pagination/`  
> Runtime: `apps/api/src/common/pagination/`  
> Example: [blogs module](../../agents/module/manifests/blogs.json) — `GET /api/admin/blogs`

---

## Contract (`@repo/api`)

| Artifact      | Path                         | Role                                                                                       |
| ------------- | ---------------------------- | ------------------------------------------------------------------------------------------ |
| Constants     | `pagination.constants.ts`    | `PAGINATION_DEFAULT_PAGE`, `PAGINATION_DEFAULT_PAGE_SIZE`, `PAGINATION_MAX_PAGE_SIZE` (50) |
| Query base    | `pagination-query.dto.ts`    | `PaginationQueryDto` — `page`, `pageSize`                                                  |
| Response meta | `paginated-list-meta.dto.ts` | `PaginatedListMetaDto` — `totalItems`, `totalPages`, `currentPage`                         |

**Module list DTOs** extend `PaginationQueryDto` and re-declare `@ApiPropertyOptional` when defaults differ (e.g. blogs `pageSize` default **9**).

**Module list responses** include `items` + the three meta fields (same shape as `PaginatedListMetaDto` + `items`).

---

## Runtime (`apps/api`)

| Function                                             | File                  | Role                                                                       |
| ---------------------------------------------------- | --------------------- | -------------------------------------------------------------------------- |
| `parsePaginationQuery(raw, options?)`                | `parse-pagination.ts` | Validate; throw `BadRequestException` + `I18nKey.Errors.Common.BadRequest` |
| `resolvePaginationSlice(pagination, totalItems)`     | same                  | `skip`, `take`, clamped `currentPage`, `totalPages`                        |
| `buildPaginatedListResult(items, slice, totalItems)` | same                  | Standard response envelope                                                 |

### Module-specific defaults

Pass `PaginationOptions` when defaults differ from global:

```typescript
const { page, pageSize } = parsePaginationQuery(raw, {
  defaultPageSize: BLOG_LIST_DEFAULT_PAGE_SIZE, // 9 for admin blogs
});
```

---

## Query naming

| Use              | Avoid                                          |
| ---------------- | ---------------------------------------------- |
| `page` (1-based) | `pageNo`, `offset` in query string             |
| `pageSize`       | `limit` unless product standard says otherwise |

**FE bridge:** URL may still use `pageNo`; map to `page` at the BFF/server fetch boundary only.

---

## Checklist — new paginated list endpoint

1. [ ] List query DTO **extends** `PaginationQueryDto` (+ filters)
2. [ ] Swagger documents `page` / `pageSize` with module default if not 10
3. [ ] Service calls `parsePaginationQuery` — no inline `Number(query.page)` magic
4. [ ] After `count`, call `resolvePaginationSlice` then `skip` / `take` on `findMany`
5. [ ] Return via `buildPaginatedListResult` (or equivalent meta fields)
6. [ ] Unit test: defaults, max `pageSize`, clamped `currentPage`
7. [ ] No unbounded `findMany` without `take`

---

## Subagent routing

| Task                           | Agents                                  |
| ------------------------------ | --------------------------------------- |
| New shared pagination behavior | `common` → this skill                   |
| Blogs list using pagination    | `blogs` manifest + `module` → `service` |
| Contract-only DTO change       | `dto`                                   |

Manifests: [common.json](../../agents/module/manifests/common.json), [blogs.json](../../agents/module/manifests/blogs.json).

---

## Anti-patterns

- Duplicating `parsePositiveInt` / page math in each service
- `pageSize` > `PAGINATION_MAX_PAGE_SIZE` without 400
- Returning full table without `take`
- Domain-specific filters inside `common/pagination` (keep filters in module service)
