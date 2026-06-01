# Optimistic updates

**When to use:** Instant UI feedback on mutations (likes, toggles, inline edit).

**Repo pattern:** `useMutation` with `onMutate` / rollback in TanStack Query; keep server as source of truth.

**Caution:** Auth-sensitive data — wait for server confirmation.
