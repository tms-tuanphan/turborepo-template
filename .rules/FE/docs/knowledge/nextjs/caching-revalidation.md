# Caching & revalidation

**When to use:** List pages, CMS content, data that can be stale briefly.

**Repo pattern:**

- Prefer fetching in Server Components with default fetch cache semantics
- After mutations: `revalidatePath` / `revalidateTag` from Server Actions
- Document cache intent in action comments when non-default

**See also:** [vercel server-cache-react](../../../skills/vercel-react-best-practices/rules/server-cache-react.md), [async-parallel](../../../skills/vercel-react-best-practices/rules/async-parallel.md)
