# Server Actions

**When to use:** Form mutations and server-side writes from the client.

**Repo pattern:**

- `features/*/actions/*.ts` with `'use server'`
- Zod validate → **service** → `revalidatePath` / `redirect`
- Never put raw `apiClient` in actions after migration — see [../../11-services-migration.md](../../11-services-migration.md)

**See also:** [fe-server-actions.mdc](../../../rules/fe-server-actions.mdc), [../../skills/form-patterns/server-action.md](../../../skills/form-patterns/server-action.md), [vercel server-auth-actions](../../../skills/vercel-react-best-practices/rules/server-auth-actions.md)
