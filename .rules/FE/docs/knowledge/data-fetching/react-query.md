# TanStack Query

**When to use:** Client-side cache, refetch, mutations from interactive UI.

**Repo pattern:**

- Provider in `core/components/query-provider.tsx`
- Hooks in `features/*/hooks/use-*.ts` with `queryKey` per entity
- `queryFn` calls Server Action or service-backed read
- Invalidate on mutation success — [../../05-code-patterns.md](../../05-code-patterns.md) § TanStack Query

**See also:** [client-swr-dedup](../../../skills/vercel-react-best-practices/rules/client-swr-dedup.md) (dedup patterns)
