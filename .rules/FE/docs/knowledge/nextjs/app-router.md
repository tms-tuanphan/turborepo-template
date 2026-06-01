# App Router

**When to use:** All new routes in `apps/web/app/`.

**Repo pattern:**

- `app/` = routing only — pages import from `@/features/*`
- Route groups `(marketing)`, `(dashboard)`; private folders `_components`
- `loading.tsx`, `error.tsx`, `not-found.tsx` per segment

**See also:** [../../03-code-organization.md](../../03-code-organization.md), [fe-next-app-router.mdc](../../../rules/fe-next-app-router.mdc)
