# Prisma and database

[← Mục lục](./README.md)

---

## Source of truth

- Schema, migrate, seed, `prisma generate` → **only** `packages/database` (`@repo/database`).
- `apps/api` injects client via `PrismaService` wrapper — **no** second `PrismaClient`.
- `DATABASE_URL` required at runtime.

After schema change: edit schema → migrate (human) → generate → update services/DTOs.

---

## Principles

- **KISS:** Readable queries; thin controllers.
- **YAGNI:** No unused indexes/relations.
- **DRY:** Shared mappers; reuse validation pipes.

---

## Nest integration

| Layer      | Role                         |
| ---------- | ---------------------------- |
| Controller | HTTP only                    |
| Service    | Business + Prisma via inject |
| Module     | Providers, imports           |

- Transactions in service; keep short.
- Map `PrismaClientKnownRequestError` → HTTP exceptions.

---

## Schema & queries

- PascalCase models, camelCase fields.
- Explicit `onDelete` / `onUpdate` when business-critical.
- `select` / `include` to avoid over-fetching.
- Avoid N+1; cap `take` in services.
- Raw SQL only when needed; parameterized.

---

## Agents

- **prisma** (core): schema/query analysis — never runs migrate ([COMMAND_POLICY](../agents/_shared/COMMAND_POLICY.md)).
- Escalation: `DB_MIGRATION` → human.

Skill: [prisma-patterns](../skills/prisma-patterns/SKILL.md) · Rule: [be-prisma.mdc](../rules/be-prisma.mdc)
