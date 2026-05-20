---
name: be-prisma-patterns
description: Prisma in monorepo — schema in packages/database, inject in Nest services, transactions, query safety. Use for DB design and persistence tasks.
---

# Prisma patterns

> Full doc: [docs/04-prisma-database.md](../../docs/04-prisma-database.md)

## Non-negotiable

- Single schema in `packages/database`
- No agent-run migrations ([COMMAND_POLICY](../../agents/_shared/COMMAND_POLICY.md))
- Escalate `DB_MIGRATION` to human

## Service pattern

```typescript
// Inject PrismaService — do not new PrismaClient()
async findAll(query: ListLinksDto) {
  const rows = await this.prisma.link.findMany({
    where: { ... },
    take: query.take,
    skip: query.skip,
  });
  return rows.map(toLinkEntity);
}
```

## Checklist

- [ ] `select`/`include` minimal
- [ ] `take` capped
- [ ] Multi-write use case → `$transaction`
- [ ] Map to `@repo/api` entity before return

## Rule & agent

- [be-prisma.mdc](../../rules/be-prisma.mdc)
- Agent: [prisma](../../agents/prisma/SKILL.md) (core)
