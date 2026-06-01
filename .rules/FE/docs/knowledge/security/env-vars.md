# Environment variables

**Rules:**

- ❌ Private secrets in Client Components or `NEXT_PUBLIC_*`
- ✅ Validate in `core/config/env.ts` (server)
- ✅ Only `NEXT_PUBLIC_*` for browser-safe config

**See also:** [fe-security.mdc](../../../rules/fe-security.mdc)
