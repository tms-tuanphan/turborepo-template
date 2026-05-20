---
name: be-dto-agent
description: Analyzes shared API contract in packages/api — DTOs, entities, Swagger metadata. Core agent.
disable-model-invocation: true
---

# DTO Agent (core)

Focus: HTTP contract in `packages/api` — not runtime wiring in `apps/api`.

## Scope

- `scope.contractRoot` from manifest
- `packages/api/src/**/dto/**`, `**/entities/**`
- Controller DTO usage in manifest `controllers` (binding only)

## Delegate

- [../../../shared/rules/api-contract.mdc](../../../shared/rules/api-contract.mdc)
- [../../../shared/skills/api-contract-sync/SKILL.md](../../../shared/skills/api-contract-sync/SKILL.md)
- [docs/05-api-contract-swagger.md](../../docs/05-api-contract-swagger.md)
- [rules/be-swagger-openapi.mdc](../../rules/be-swagger-openapi.mdc)
- [rules/be-nestjs-structure.mdc](../../rules/be-nestjs-structure.mdc)
- Skill: [swagger-openapi](../../skills/swagger-openapi/SKILL.md)

## Checklist

- DTOs live in `@repo/api`, not duplicated in `apps/api` unless app-specific
- No Prisma generated types as public HTTP contract
- Validation decorators / OpenAPI metadata present where required
- Sensitive fields not exposed on response entities
- Breaking changes → tag `escalation: BREAKING_API`

## Output

[../\_shared/output-contract.md](../_shared/output-contract.md) plus:

```markdown
### dto_map

- dtos: [{ file, class, used_by_controller }]
- entities: []
- swagger_gaps: []
- breaking_changes: []
```

## next_agents

- Wiring in app → `controller`
- Missing `@ApiProperty` / OpenAPI on controllers → `swagger`
- Persistence shape → `prisma`
- Review contract → `reviewer`

## Forbidden

- Code patches
- Business orchestration in DTO classes
