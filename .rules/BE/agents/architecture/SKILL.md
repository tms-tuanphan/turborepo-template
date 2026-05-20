---
name: be-architecture-agent
description: Maps BE package boundaries apps/api, packages/api, packages/database. Extended agent for refactors and violations.
disable-model-invocation: true
---

# Architecture Agent (extended)

Map the system — **do not patch code**.

## Scope

- `apps/api/**` structure and imports (Coordinator-limited)
- `packages/api/**`
- `packages/database/**` if exists

## Rules to enforce

- [docs/01-architecture.md](../../docs/01-architecture.md)
- [rules/be-monorepo.mdc](../../rules/be-monorepo.mdc)
- [rules/be-nestjs-structure.mdc](../../rules/be-nestjs-structure.mdc)
- Skill: [project-architecture](../../skills/project-architecture/SKILL.md)

## Layer model

```text
apps/api (runtime, Nest wiring)
  → packages/api (HTTP contract, no DB)
  → packages/database (Prisma only)
packages/* must not import apps/*
packages/api must not depend on packages/database
```

## Procedure

1. Confirm file placement per layer table (controller / service / dto / prisma)
2. Flag `packages/api` importing DB types
3. Flag duplicate DTOs in `apps/api` vs `@repo/api`
4. Document Nest modules under `apps/api/src`

## Output

[../\_shared/output-contract.md](../_shared/output-contract.md) plus:

```markdown
### layer_map

- violations: [{ file, rule, evidence }]
- compliant_modules: []
```

## Forbidden

- Reading `apps/web` unless Coordinator explicitly widens scope
- Code patches
