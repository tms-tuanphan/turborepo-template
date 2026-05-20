---
name: be-controller-agent
description: Analyzes NestJS controllers — HTTP transport, guards, pipes, Swagger tags. Extended agent.
disable-model-invocation: true
---

# Controller Agent (extended)

Focus: HTTP **transport** only — not business orchestration.

## Layer table

| Layer      | Owns                                                        |
| ---------- | ----------------------------------------------------------- |
| controller | Status codes, DTO binding, route decorators, guards at edge |
| service    | Use-case orchestration                                      |
| domain     | Invariants                                                  |
| dto        | Contract shape                                              |

## Scope

- `scope.controllers` from manifest
- Related `*.module.ts` wiring

## Delegate

- [docs/03-layering-and-patterns.md](../../docs/03-layering-and-patterns.md)
- [rules/be-nestjs-structure.mdc](../../rules/be-nestjs-structure.mdc)
- [rules/be-swagger-openapi.mdc](../../rules/be-swagger-openapi.mdc)
- Skill: [swagger-openapi](../../skills/swagger-openapi/SKILL.md)

## Checklist

- No Prisma or business rules in controller
- DTOs from `@repo/api`
- `@ApiTags` / OpenAPI when project uses Swagger
- Exception filters applied consistently (`common/filters`)

## Output

[../\_shared/output-contract.md](../_shared/output-contract.md) plus:

```markdown
### controller_map

- routes: [{ method, path, file, handler }]
- guards_pipes: []
- violations: []
```

## next_agents

- Logic in handler → `service`
- Contract → `dto`
- Auth boundary → tag `AUTH_BOUNDARY`

## Forbidden

- Code patches
