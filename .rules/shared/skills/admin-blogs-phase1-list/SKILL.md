---
name: shared-admin-blogs-phase1-list
description: Implement BE admin blogs list (GET /api/admin/blogs) aligned with FE admin-blogs CMS. Phase 1 only — no CRUD, upload, public API, or blog-ai.
---

# Admin blogs — Phase 1 list (BE)

> Mapping: [mappings/blogs.json](../../mappings/blogs.json)  
> API design: [API_ADMIN_BLOGS_DESIGN.md](../../../BE/docs/API_ADMIN_BLOGS_DESIGN.md)  
> BE manifest: [blogs.json](../../../BE/agents/module/manifests/blogs.json)  
> FE manifest: [admin-blogs.json](../../../FE/agents/feature/manifests/admin-blogs.json)

**Goal:** Replace FE in-memory `listAllBlogs()` + client `filterAndPaginateBlogs` with `GET /api/admin/blogs`.

---

## In scope (phase 1)

- `GET /api/admin/blogs` with server-side filter + pagination
- Prisma `Blog` model (list query **excludes** `content` from response DTO)
- DTOs in `@repo/api`: query + `BlogListItemDto` + list response
- `BlogsService.findAdminList` + `AdminBlogsController`
- Unit test: `blogs.service.spec.ts`
- Update `blogs.json` manifest `scope` when Nest/DTO files exist (move from `planned`)

## Out of scope

- `GET :id`, `POST`, `PATCH`, `DELETE`, `check-slug`, `upload-cover`
- Public `/api/blogs`
- Blog AI (`/api/admin/blog-ai/*`)
- Full FE migration (unless requested) — document `pageNo` → `page` bridge only
- `createdById` / `updatedById` / `deletedAt` implementation (design only in phase 1)

---

## API contract

### Request

```http
GET /api/admin/blogs?search=&category=ALL&status=ALL&page=1&pageSize=9
```

| Query      | Rules                                                                                 |
| ---------- | ------------------------------------------------------------------------------------- |
| `page`     | not `pageNo` — [pagination-patterns](../../../BE/skills/pagination-patterns/SKILL.md) |
| `pageSize` | default 9 (`BLOG_LIST_DEFAULT_PAGE_SIZE`), max 50 (`PAGINATION_MAX_PAGE_SIZE`)        |

### Response

```ts
{
  items: BlogListItemDto[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
```

---

## Layer ownership

| Layer                 | Owns                                    | Must not                   |
| --------------------- | --------------------------------------- | -------------------------- |
| `packages/api`        | Query/response DTOs, Swagger decorators | Prisma, filter SQL         |
| `packages/database`   | Schema, migration                       | HTTP                       |
| `apps/api` controller | Bind query DTO, `@Roles`, Swagger       | Filter logic in controller |
| `apps/api` service    | Filter, pagination, map to list DTO     | Return `content` in list   |
| `apps/web`            | UI, URL `pageNo` until migrated         | Blog persistence           |

---

## Coordinator — subagent list (phase 1)

**Tier:** Medium  
**Escalation:** `DB_MIGRATION` after schema change

| Order | Agent           | Task                                                                                             |
| ----- | --------------- | ------------------------------------------------------------------------------------------------ |
| 1     | `module`        | Read manifest + design; planned file list                                                        |
| 2     | `prisma`        | `Blog` + enums; list select omits `content` in DTO mapping                                       |
| 3     | `dto`           | `AdminBlogListQueryDto` extends `PaginationQueryDto`, list response DTOs                         |
| 4     | `service`       | `findAdminList` — `parsePaginationQuery` / `resolvePaginationSlice` / `buildPaginatedListResult` |
| 5     | `controller`    | `GET admin/blogs`, `@ApiCookieAuth`, `@Roles('admin','sub_admin')`                               |
| 6     | `quality-gates` | lint, test, build                                                                                |
| 7     | `reviewer`      | diff only                                                                                        |

**Parallel:** `dto` + `prisma`.  
**Max extended:** 1 (`swagger` audit if OpenAPI gaps).

### Task prompt template

```text
Phase: admin-blogs list only (GET /api/admin/blogs).
Follow .rules/shared/skills/admin-blogs-phase1-list/SKILL.md
and .rules/BE/docs/API_ADMIN_BLOGS_DESIGN.md.
Manifest: blogs.json (inline).
Do NOT implement CRUD, upload, public blogs, or blog-ai.
Query: page + pageSize (max 50), not pageNo.
List response must omit content.
Output per .rules/BE/agents/_shared/output-contract.md.
```

---

## Implementation checklist

### Prisma

- [ ] `BlogCategory`, `BlogStatus` enums
- [ ] `Blog` model per design doc
- [ ] `tags String[]`
- [ ] `@@unique([slug])`, index `(status, updatedAt)`

### DTO (`packages/api`)

- [ ] `AdminBlogListQueryDto` extends `PaginationQueryDto` ([pagination-patterns](../../../BE/skills/pagination-patterns/SKILL.md))
- [ ] `BlogListItemDto` — no `content`
- [ ] `AdminBlogListResponseDto`
- [ ] Export in `entry.ts`

### Service / controller / tests

- [ ] `findAdminList` — shared pagination helpers + filters; sort `updatedAt desc`
- [ ] `GET admin/blogs` + auth
- [ ] `blogs.service.spec.ts` with factory

### Manifest

- [ ] Promote `scope.planned` paths into `scope` when files exist
- [ ] `pnpm be:manifest-check`

---

## FE integration (later)

| FE today                 | Target                       |
| ------------------------ | ---------------------------- |
| `loadAdminBlogsPage`     | fetch `GET /api/admin/blogs` |
| `pageNo` in URL          | map → `page` for API         |
| `filterAndPaginateBlogs` | remove for admin list        |

---

## Acceptance criteria

1. Authenticated admin gets paginated filtered list.
2. Response items never include `content`.
3. `pageSize` > 50 → 400.
4. Swagger documents query + response.
5. `pnpm be:manifest-check` passes after scope paths updated.
