# Caching strategies

| Layer         | Tool                                              |
| ------------- | ------------------------------------------------- |
| Server render | Next.js fetch cache, RSC                          |
| Client        | TanStack Query `staleTime` / `gcTime`             |
| After write   | `revalidatePath`, `queryClient.invalidateQueries` |

**See also:** [../nextjs/caching-revalidation.md](../nextjs/caching-revalidation.md), [server-cache-react](../../../skills/vercel-react-best-practices/rules/server-cache-react.md)
