# Project structure

[← Mục lục](./README.md)

---

## `apps/api/src`

Module-first + `common/` for cross-cutting:

```text
apps/api/src/
  main.ts
  app.module.ts
  config/
  common/           # filters, guards, pipes, interceptors only
  prisma/           # Nest wrapper for @repo/database (when wired)
  health/
  links/            # example domain module
    links.module.ts
    links.controller.ts
    links.service.ts
```

- One domain = one folder (`links/`, `users/`).
- Do not put domain logic in `app.service.ts`.
- App-specific DTO only when not shared; prefer `packages/api`.

---

## `packages/api/src`

```text
packages/api/src/
  entry.ts
  links/
    dto/
    entities/
  common/
    i18n/keys.ts
```

Contract + validation + `@ApiProperty` live here.

---

## `packages/database` (when present)

```text
packages/database/
  prisma/schema.prisma
  src/client.ts
```

Single source for schema, migrate, generate.

---

## `apps/api/test`

```text
apps/api/test/
  jest-e2e.json
  factories/
  helpers/
```

Unit specs colocated: `src/**/*.spec.ts`.

Detail: [06-testing.md](./06-testing.md).
