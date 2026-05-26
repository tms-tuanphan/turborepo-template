# API Admin Blogs Design

Version: 1.0  
Architecture: Next.js (FE) · NestJS (BE) · PostgreSQL · Prisma

Scope: Admin CMS for blog posts.

**Implemented (BE):**

- `GET /api/admin/blogs` — list
- `GET /api/admin/blogs/check-slug`, `GET :id`, `POST`, `PATCH :id`, `DELETE :id` (soft delete)
- `GET /api/admin/blog-categories` — list categories (`nameKey` for FE i18n)
- `POST|PATCH|DELETE /api/admin/blog-categories` — **admin role only**; delete returns `409` if blogs exist

**Schema:** `BlogStatus` = `PUBLISHED` | `UNPUBLISHED`; `BlogCategory` table (`slug`, `nameKey`); no `tags`, no `scheduledAt`.

**Later:** upload-cover, public API, views counter.

FE reference: `apps/web/features/admin-blogs`, `loadAdminBlogsPage`, `BlogPost` in `apps/web/shared/types/blog.ts`.

Cross mapping: [.rules/shared/mappings/blogs.json](../../shared/mappings/blogs.json)  
Phase 1 skill: [.rules/shared/skills/admin-blogs-phase1-list/SKILL.md](../../shared/skills/admin-blogs-phase1-list/SKILL.md)

---

## Namespace

| Scope          | Prefix             |
| -------------- | ------------------ |
| Admin CMS      | `/api/admin/blogs` |
| Public (later) | `/api/blogs`       |

---

## Phase 1 — Admin list (build now)

### Endpoint

| Method | Path               | Auth                                     |
| ------ | ------------------ | ---------------------------------------- |
| `GET`  | `/api/admin/blogs` | JWT cookie + role `admin` \| `sub_admin` |

### Query parameters

Use standard paging names (not `pageNo`):

| Param      | Type   | Default | Rules                                                                                             |
| ---------- | ------ | ------- | ------------------------------------------------------------------------------------------------- |
| `search`   | string | `""`    | trim, max 120                                                                                     |
| `category` | enum   | `ALL`   | `ALL` \| `IT_PARTNERSHIP` \| `DAAS` \| `AI`                                                       |
| `status`   | enum   | `ALL`   | `ALL` \| `DRAFT` \| `REVIEWING` \| `SCHEDULED` \| `PUBLISHED` \| `ARCHIVED`                       |
| `page`     | int    | `1`     | min 1                                                                                             |
| `pageSize` | int    | `9`     | min 1, **max 50** — shared `PAGINATION_MAX_PAGE_SIZE`; parse via `apps/api/src/common/pagination` |

**FE bridge (temporary):** Admin UI URL still uses `pageNo` in search params. BFF or server fetch maps `pageNo` → `page` when calling Nest. Remove mapping once FE adopts `page`.

### Search (server-side)

Match (case-insensitive) against: `title`, `description`, `slug`, `author`, and `tags` (array join).

### Sort

`updatedAt` DESC.

### Response `200`

```json
{
  "items": [],
  "totalItems": 0,
  "totalPages": 1,
  "currentPage": 1
}
```

`items` are `BlogListItemDto[]` — **no `content` field**.

### `BlogListItemDto` (list payload)

| Field                                                                                   | In list response                                                        |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `id`, `slug`, `title`, `description`, `category`, `tags`, `status`                      | yes                                                                     |
| `coverImage`, `author`, `views`, `publishedAt`, `scheduledAt`, `createdAt`, `updatedAt` | yes                                                                     |
| `seo`                                                                                   | `metaTitle`, `metaDescription` (omit `primaryKeyword` in list optional) |
| `content`                                                                               | **never**                                                               |

### `BlogDetailDto` (later phases)

Full post including `content` + full `seo`. Used by `GET :id`, create/update responses.

### Errors

| HTTP | When                            |
| ---- | ------------------------------- |
| 401  | No / invalid session            |
| 403  | Authenticated but wrong role    |
| 400  | Invalid query (class-validator) |

Use `ApiErrorPayloadDto` + `I18nKey` where applicable.

---

## Data model (Prisma — design target)

Enums: `BlogCategory`, `BlogStatus` (match FE `BLOG_CATEGORIES`, `BLOG_STATUSES`).

| Field                | Type       | Notes                                          |
| -------------------- | ---------- | ---------------------------------------------- |
| `id`                 | cuid/uuid  |                                                |
| `slug`               | string     | unique, lowercase normalized in service        |
| `title`              | string     |                                                |
| `description`        | string     | excerpt / summary                              |
| `content`            | text       | not selected in list query                     |
| `category`           | enum       |                                                |
| `tags`               | `String[]` | **only** `string[]` on API wire                |
| `status`             | enum       |                                                |
| `coverImage`         | string     | URL only in DB (no base64)                     |
| `author`             | string     | display name at publish time                   |
| `views`              | int        | default 0; read-only on write APIs             |
| `publishedAt`        | DateTime?  |                                                |
| `scheduledAt`        | DateTime?  |                                                |
| `seoMetaTitle`       | string     | or JSON `seo` column                           |
| `seoMetaDescription` | string     |                                                |
| `seoPrimaryKeyword`  | string?    |                                                |
| `createdById`        | string?    | FK User — phase 2+                             |
| `updatedById`        | string?    | FK User — phase 2+                             |
| `createdAt`          | DateTime   |                                                |
| `updatedAt`          | DateTime   |                                                |
| `deletedAt`          | DateTime?  | soft delete — phase 2+; list excludes non-null |

**List query:** `where: { deletedAt: null }` when soft delete exists.

**Indexes (phase 1):** `(status, updatedAt)`, `(category)`, unique `(slug)`.

---

## Design policies

### Pagination

- Query: `page` + `pageSize`, not `pageNo`.
- Cap `pageSize` at 50 (`PAGINATION_MAX_PAGE_SIZE`).
- Shared contract: `PaginationQueryDto` (`@repo/api`); runtime: `parsePaginationQuery`, `resolvePaginationSlice`, `buildPaginatedListResult`.
- Playbook: [pagination-patterns/SKILL.md](../skills/pagination-patterns/SKILL.md).

### Tags

- API contract: `tags: string[]` only.
- FE may parse CSV in forms; server normalizes to array before persist.

### Content validation (later CRUD)

| Status                   | `content`                      |
| ------------------------ | ------------------------------ |
| `PUBLISHED`, `REVIEWING` | required                       |
| `DRAFT`                  | optional                       |
| `SCHEDULED`              | required + valid `scheduledAt` |

### Slug (later create/update)

- Regex: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- Service: lowercase, trim, Unicode normalize, collapse dashes.
- Unique + `409 slugTaken`.

### Soft delete (phase 2+)

- `deletedAt` preferred over hard delete.
- `ARCHIVED` = workflow; `deletedAt` = hidden from list.

### Audit (phase 2+)

- `createdById` / `updatedById` from JWT `sub`.
- Keep `author` as display string.

### Views

- Not writable via create/update DTO.
- Increment via separate endpoint later.

### Status actions (phase 2+)

- MVP: single `PATCH` with `status`.
- Optional: `PATCH /publish`, `/archive`, `/schedule`.

### Transactions (phase 2+)

- `prisma.$transaction()` when upload + create + publish in one flow.

### RBAC (future)

| Role        | Phase 1 list               |
| ----------- | -------------------------- |
| `admin`     | read all                   |
| `sub_admin` | read all (confirm product) |

Phase 1: `@Roles('admin', 'sub_admin')` on controller.

---

## Later phases

| Phase | Endpoints                                      |
| ----- | ---------------------------------------------- |
| 2     | Done — blog CRUD + check-slug + categories API |
| 3     | `POST upload-cover`                            |
| 4     | Public `GET /blogs`, `GET /blogs/:slug`        |
| 5     | Views counter                                  |

---

## Contract package (`@repo/api`)

Phase 1 (planned):

```text
packages/api/src/blogs/dto/admin-blog-list-query.dto.ts
packages/api/src/blogs/dto/blog-list-item.dto.ts
packages/api/src/blogs/dto/admin-blog-list-response.dto.ts
```

---

## Nest module (planned)

```text
apps/api/src/blogs/blogs.module.ts
apps/api/src/blogs/controllers/admin-blogs.controller.ts
apps/api/src/blogs/controllers/admin-blog-categories.controller.ts
apps/api/src/blogs/services/blogs.service.ts
apps/api/src/blogs/services/blog-categories.service.ts
apps/api/src/blogs/mappers/blogs.mapper.ts
apps/api/src/blogs/utils/blogs-slug.util.ts
apps/api/src/blogs/services/blogs.service.spec.ts
```

---

## FE ↔ BE alignment (phase 1)

| FE today                                | BE target              |
| --------------------------------------- | ---------------------- |
| `loadAdminBlogsPage` → `listAllBlogs()` | `GET /api/admin/blogs` |
| URL `pageNo`                            | map → `page` at fetch  |
| Client `filterAndPaginateBlogs`         | server pagination      |
| Table columns                           | `BlogListItemDto`      |

---

## Subagent orchestration (phase 1)

**Tier:** Medium  
**Manifest:** `blogs`  
**Escalation:** `DB_MIGRATION` when Prisma `Blog` model is added

```text
module → prisma → dto → service → controller → quality-gates → reviewer
```

Skill: [admin-blogs-phase1-list/SKILL.md](../../shared/skills/admin-blogs-phase1-list/SKILL.md).
