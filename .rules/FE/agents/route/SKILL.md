---
name: fe-route-agent
description: Analyzes Next.js App Router routes, layouts, loading/error boundaries under apps/web/app. Use for routing, RSC boundaries, and page-level UX.
disable-model-invocation: true
---

# Route Agent

Focus: **routing shell** only — not feature business logic bodies unless wired from `app/`.

## Scope

- `apps/web/app/**` only

## Rules

- [../../rules/fe-next-app-router.mdc](../../rules/fe-next-app-router.mdc)
- [../../docs/02-project-structure.md](../../docs/02-project-structure.md)

## Procedure

1. Map route segments: `[locale]`, route groups `(site)`, `(admin)`
2. List `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` per segment
3. Identify Server vs Client components (`'use client'`)
4. Note colocated `_actions` or API routes under `app/`
5. Trace which feature public API each page imports

## Output

[output-contract](../_shared/output-contract.md) plus:

```markdown
### route_map

- routes: [{ path, page_file, layouts, boundaries }]
- feature_wiring: [{ route, imports_from_feature }]
- issues: []
```

## Delegate

Server Actions in `app/` → suggest `api` agent for mutation patterns.
