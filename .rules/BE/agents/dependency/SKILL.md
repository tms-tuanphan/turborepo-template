---
name: be-dependency-agent
description: Builds scoped import graphs for BE packages using manifest or explicit roots. Extended agent.
disable-model-invocation: true
---

# Dependency Agent (extended)

Build an **import graph** within Coordinator-provided scope only.

## Input

- Module manifest `scope` + `forbiddenRoots`, or
- Explicit roots: `["apps/api/src/links", "packages/api/src/links"]`

## Procedure

1. List `.ts` files under scope roots
2. Extract `import` / `import type` lines
3. Resolve `@repo/*` workspace packages
4. Flag edges that cross:
   - `forbiddenRoots`
   - `packages/*` → `apps/*`
   - `packages/api` → `packages/database`

## Tools

- Prefer `Grep` with `path` = scope root
- No repo-wide search without scope

## Output

[../\_shared/output-contract.md](../_shared/output-contract.md) plus:

```markdown
### import_graph

- nodes: []
- edges: [{ from, to, line }]
- violations: [{ edge, rule }]
```

## Delegate

- [docs/01-architecture.md](../../docs/01-architecture.md)
- [rules/be-monorepo.mdc](../../rules/be-monorepo.mdc)

## Forbidden

- Code patches
