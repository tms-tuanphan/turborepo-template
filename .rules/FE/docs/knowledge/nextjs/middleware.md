# Middleware

**When to use:** Global redirects, locale, coarse auth gate — not fine-grained authorization.

**Repo pattern:**

- `apps/web/middleware.ts` + `matcher` config
- Pair with [auth-patterns middleware reference](../../../skills/auth-patterns/references/middleware-auth.md)
- Mutations still need auth checks inside Server Actions

**See also:** [../../05-code-patterns.md](../../05-code-patterns.md) § Middleware
