---
name: be-common-agent
description: Analyzes cross-cutting Nest infra in apps/api/src/common — filters, guards, pipes, decorators. Extended agent.
disable-model-invocation: true
---

# Common Agent (extended)

Focus: `apps/api/src/common/**` — shared infrastructure, not domain modules.

## Scope

- `apps/api/src/common/**`
- Imports from common into manifest `moduleRoot` (one hop)

## Delegate

- [docs/02-project-structure.md](../../docs/02-project-structure.md)
- [rules/be-nestjs-structure.mdc](../../rules/be-nestjs-structure.mdc) — `common/` is not a junk drawer

## Checklist

- Filters / interceptors / guards are generic, not domain-specific
- No domain business rules in common
- Exception mapping consistent with API error contract
- Avoid growing common — suggest module-local when domain-specific

## Output

[../\_shared/output-contract.md](../_shared/output-contract.md) plus:

```markdown
### common_map

- filters: []
- guards: []
- pipes: []
- interceptors: []
- violations: []
```

## next_agents

- Domain-specific logic misplaced → `service` or `domain`
- HTTP edge → `controller`

## Forbidden

- Code patches
