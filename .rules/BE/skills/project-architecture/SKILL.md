---
name: be-project-architecture
description: NestJS 3-package architecture and layer model for apps/api and packages/api. Use when creating modules, placing files, or reviewing boundaries.
---

# Backend project architecture

> Full docs: [docs/01-architecture.md](../../docs/01-architecture.md), [docs/02-project-structure.md](../../docs/02-project-structure.md), [docs/03-layering-and-patterns.md](../../docs/03-layering-and-patterns.md)

## Quick reference

```text
apps/api          → Nest runtime (controller, service, common)
packages/api      → DTO, entities, i18n keys (no DB)
packages/database → Prisma only
```

## Layers

| Layer      | File pattern                      |
| ---------- | --------------------------------- |
| controller | `*.controller.ts`                 |
| service    | `*.service.ts`                    |
| contract   | `packages/api/**/dto`, `entities` |

## Module checklist

1. One folder under `apps/api/src/<domain>/`
2. Contract in `packages/api/src/<domain>/`
3. Manifest: [agents/module/manifests/](../../agents/module/manifests/)
4. `pnpm be:manifest-check`

## Rules

- [be-monorepo.mdc](../../rules/be-monorepo.mdc)
- [be-nestjs-structure.mdc](../../rules/be-nestjs-structure.mdc)

## Sub-agents

- **architecture** (extended) — boundary violations
- **module** (core) — scoped manifest
