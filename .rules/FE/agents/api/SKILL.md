---
name: fe-api-agent
description: Analyzes Server Actions, route handlers, and auth for apps/web mutations and APIs. Use for forms, actions, and app/api routes.
disable-model-invocation: true
---

# API Agent

Focus: **server mutations and HTTP entrypoints** in scope.

## Scope patterns

- `**/services/**`
- `**/actions/**`
- `apps/web/app/api/**`
- `'use server'` files
- `apps/web/auth.ts`, `core/auth/**`

## Delegate

- [../../../shared/rules/api-contract.mdc](../../../shared/rules/api-contract.mdc) when `@repo/api` or HTTP contract
- [../../skills/auth-patterns/SKILL.md](../../skills/auth-patterns/SKILL.md)
- [../../skills/form-patterns/SKILL.md](../../skills/form-patterns/SKILL.md) — Server Actions, Zod
- [../../rules/fe-import-boundaries.mdc](../../rules/fe-import-boundaries.mdc)
- [../../rules/fe-server-actions.mdc](../../rules/fe-server-actions.mdc)
- [../../rules/fe-services-layer.mdc](../../rules/fe-services-layer.mdc)
- [../../docs/11-services-migration.md](../../docs/11-services-migration.md)

## Checklist

- HTTP/fetch lives in `features/*/services/*.service.ts` — not in components
- Server Actions: orchestration only — Zod → service → `revalidatePath`
- Server Actions: `'use server'`, Zod validation, `revalidatePath`
- Route handlers: auth check inside handler (not middleware-only)
- No secrets in client bundles
- Error handling returns safe messages (i18n keys where applicable)
- NextAuth / session usage per auth skill

## Output

[output-contract](../_shared/output-contract.md) plus:

```markdown
### api_map

- services: [{ file, exports }]
- server_actions: [{ file, exports, validates_with, calls_service }]
- route_handlers: [{ path, file, auth }]
- security_issues: []
```

## next_agents

- Schema gaps → `validation`
- Error message keys → `i18n`
- Session/auth unclear → re-read auth skill + `feature`

## Forbidden

- Inventing API endpoints not in repo
