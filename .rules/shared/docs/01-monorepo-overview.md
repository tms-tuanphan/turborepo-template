# Monorepo overview

[← Index](./README.md)

---

## Diagram

```text
apps/web (Next.js)     apps/api (NestJS)
        \                   /
         \                 /
          v               v
       packages/api (@repo/api)  ← shared HTTP contract
                |
                v (BE only, when wired)
       packages/database (@repo/database)

apps/web ──► packages/ui (@repo/ui)
```

## Package table

| Path                | Name             | Consumers                           |
| ------------------- | ---------------- | ----------------------------------- |
| `apps/web`          | `web`            | End users                           |
| `apps/api`          | `api`            | HTTP clients, FE server actions     |
| `packages/api`      | `@repo/api`      | `apps/api`, `apps/web` (types/keys) |
| `packages/database` | `@repo/database` | `apps/api` only                     |
| `packages/ui`       | `@repo/ui`       | `apps/web` only                     |

## Dependency rules

- `workspace:*` for internal packages
- No `packages/*` → `apps/*`
- `packages/api` must not import `packages/database`

## Turbo

From [turbo.json](../../../turbo.json):

- `build.dependsOn: ["^build"]` — libraries build before apps
- Shared env keys listed in `globalEnv` (e.g. auth for web)

## Commands

See [09-monorepo BE doc](../../BE/docs/09-monorepo-and-commands.md) for API-specific commands and [FE package CI](../../FE/docs/07-package-cicd.md) for web scripts.

Rule: [turbo-workspace.mdc](../rules/turbo-workspace.mdc)
