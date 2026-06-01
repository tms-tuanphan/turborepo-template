# Route handlers

**When to use:** Webhooks, third-party callbacks, REST endpoints that are not Server Actions.

**Repo pattern:**

- `apps/web/app/api/**/route.ts`
- Auth inside handler; Zod for body; delegate to `core/services` or feature services

**See also:** [fe-server-actions.mdc](../../../rules/fe-server-actions.mdc), [async-api-routes](../../../skills/vercel-react-best-practices/rules/async-api-routes.md)
