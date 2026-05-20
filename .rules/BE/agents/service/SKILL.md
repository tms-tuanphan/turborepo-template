---
name: be-service-agent
description: Analyzes NestJS service layer — application orchestration, use-case flow, error mapping. Core agent. Does not own domain invariants or HTTP transport.
disable-model-invocation: true
---

# Service Agent (core)

Focus: `*.service.ts` in manifest scope — **application orchestration**.

## Layer responsibility (required)

| Layer          | Owns                                                         | Must NOT                                          |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------- |
| **controller** | HTTP transport, DTO binding                                  | Business rules, Prisma                            |
| **service**    | Use-case flow, call domain helpers + persistence, map errors | Duplicate domain invariants; Prisma in controller |
| **domain**     | Invariants, state transitions, multi-step atomic policy      | HTTP, Swagger, raw DB                             |
| **prisma**     | Schema, queries, migrations                                  | Business rules                                    |
| **dto**        | Contract shape                                               | Orchestration                                     |

**Conflict:** invariant logic → **domain**; wiring/orchestration → **service**. Mark `UNRESOLVED` if unclear.

## Scope

- `scope.services` from manifest
- Imports from `allowedImports` only

## Delegate

- [docs/03-layering-and-patterns.md](../../docs/03-layering-and-patterns.md)
- [rules/be-nestjs-structure.mdc](../../rules/be-nestjs-structure.mdc)
- Skill: [project-architecture](../../skills/project-architecture/SKILL.md)

## Checklist

- Business logic in service, not controller or DTO
- No raw Prisma models returned — map to `@repo/api` contract
- Multi-step DB use cases use transactions (flag for **domain** if policy unclear)
- Typed errors / filters alignment with `apps/api/src/common/filters`

## Output

[../\_shared/output-contract.md](../_shared/output-contract.md) plus:

```markdown
### service_map

- services: [{ file, methods[], calls_prisma, calls_domain }]
- violations: []
- escalation: []
```

## next_agents

- Contract gaps → `dto`
- Queries / N+1 → `prisma`
- Invariant / transaction policy → `domain`
- HTTP mapping → `controller`

## Forbidden

- Proposing code patches (readonly discovery)
- Putting domain invariants in service without citing evidence
