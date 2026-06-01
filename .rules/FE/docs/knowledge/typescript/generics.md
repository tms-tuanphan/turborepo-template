# Generics

**When to use:** Shared hooks, API wrappers, table column defs.

**Repo pattern:**

- `ApiResponse<T>` in `core/types/api.ts`
- TanStack Query `useQuery<User[]>` with typed `queryFn`
- `@repo/api` contract types for cross-stack DTOs

**See also:** [../../01-architecture.md](../../01-architecture.md) Tech Stack
