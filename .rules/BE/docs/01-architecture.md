# Backend architecture overview

[← Mục lục](./README.md)

---

## Three-package boundary

```text
apps/api          → NestJS runtime (bootstrap, modules, controllers, services)
packages/api      → HTTP contract (DTO, entities, constants) — no DB access
packages/database → Prisma schema, migrate, seed, client (source of truth)
```

| Package             | Must                                 | Must NOT                            |
| ------------------- | ------------------------------------ | ----------------------------------- |
| `apps/api`          | Wire Nest, orchestration in services | Own `schema.prisma`; duplicate DTOs |
| `packages/api`      | Stable API shapes + Swagger metadata | Import `packages/database`          |
| `packages/database` | Schema, client singleton             | HTTP / Nest decorators              |

Dependency direction: `apps/api` → `@repo/api`, `@repo/database`. `packages/api` **không** phụ thuộc DB package.

---

## Layer model (HTTP stack)

| Layer                    | Owns                                                          | Must NOT                     |
| ------------------------ | ------------------------------------------------------------- | ---------------------------- |
| **controller**           | Transport, status, DTO binding, guards at edge                | Business rules, Prisma       |
| **service**              | Use-case orchestration, call domain + persistence, map errors | Duplicate domain invariants  |
| **domain**               | Invariants, state transitions, transaction **policy**         | HTTP, Swagger, raw DB driver |
| **prisma**               | Queries, schema, migrations                                   | Business rules               |
| **dto** (`packages/api`) | Contract + input validation metadata                          | Orchestration                |

**Conflict:** invariant → **domain**; wiring → **service**.

Chi tiết pattern: [03-layering-and-patterns.md](./03-layering-and-patterns.md).

---

## Sub-agents

Complex tasks: [agents/coordinator/AGENTS.md](../agents/coordinator/AGENTS.md) — core agents `module`, `service`, `dto`, `prisma`, `quality-gates`, `reviewer`.

---

## Related rules

- [be-monorepo.mdc](../rules/be-monorepo.mdc)
- [be-nestjs-structure.mdc](../rules/be-nestjs-structure.mdc)
