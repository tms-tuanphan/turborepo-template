---
name: fe-dependency-agent
description: Builds scoped import graphs for apps/web using manifest or explicit roots. Use before refactors or performance work to see coupling.
disable-model-invocation: true
---

# Dependency Agent

Build an **import graph** within Coordinator-provided scope only.

## Input

- Feature manifest `scope` + `forbiddenRoots`, or
- Explicit list: `["apps/web/features/blogs", "apps/web/app/.../blogs"]`

## Procedure

1. List all `.ts`/`.tsx` under scope roots
2. For each file, extract `import` / `import type` lines (`grep "^import"`)
3. Resolve `@/` aliases to `apps/web/`
4. Flag edges that cross:
   - `forbiddenRoots`
   - feature → feature
   - ui → features/core
   - app route → wrong layer (business logic in `app/` without `_` private folder)

## Tools

- Prefer `Grep` with `path` = scope root
- Do not run repo-wide search without scope

## Output

[output-contract](../_shared/output-contract.md) plus:

```markdown
### import_graph

- nodes: [files]
- edges: [{ from, to, line }]
- violations: [{ edge, rule }]
```

## Optional (future)

If `dependency-cruiser` config exists, reference its output instead of manual grep.
