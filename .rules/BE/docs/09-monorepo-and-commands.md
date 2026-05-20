# Monorepo and commands

[← Mục lục](./README.md)

---

## Layout

| Path                   | Package             | Role           |
| ---------------------- | ------------------- | -------------- |
| `apps/api`             | `api`               | NestJS runtime |
| `apps/web`             | `web`               | Next.js (FE)   |
| `packages/api`         | `@repo/api`         | API contract   |
| `packages/database`    | `@repo/database`    | Prisma         |
| `packages/ui`          | `@repo/ui`          | Shared UI      |
| `packages/jest-config` | `@repo/jest-config` | Jest presets   |

Internal deps: `"@repo/xxx": "workspace:*"`. No `../../packages/...` imports.

---

## Boundaries

- Runtime → `apps/*`; shared → `packages/*`.
- `packages/*` must not import `apps/*`.
- `packages/api` must not depend on `packages/database`.

---

## Root commands (Turbo)

| Command                  | Purpose                      |
| ------------------------ | ---------------------------- |
| `pnpm dev`               | turbo dev                    |
| `pnpm build`             | turbo build (^build graph)   |
| `pnpm lint`              | turbo lint                   |
| `pnpm test`              | turbo test                   |
| `pnpm be:manifest-check` | validate BE module manifests |

### API app

| Command                         | Purpose          |
| ------------------------------- | ---------------- |
| `pnpm --filter api lint`        | ESLint           |
| `pnpm --filter api test`        | Jest unit        |
| `pnpm --filter api build`       | nest build       |
| `pnpm --filter api test:e2e`    | E2E              |
| `pnpm --filter @repo/api build` | contract compile |

### Database (when package exists)

Human only for migrate — see [COMMAND_POLICY](../agents/_shared/COMMAND_POLICY.md).

---

## Adding packages

1. `apps/<name>` or `packages/<name>`
2. `"name": "@repo/<pkg>"` for packages
3. `workspace:*` internal deps
4. Register turbo tasks if new scripts

Rule: [be-monorepo.mdc](../rules/be-monorepo.mdc)
