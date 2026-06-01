# Error boundaries

**When to use:** Recoverable route errors, client subtree failures.

**Repo pattern:**

- `app/**/error.tsx` with `'use client'` + `reset()`
- Log in `useEffect`; user-safe copy (i18n)

**See also:** [../../05-code-patterns.md](../../05-code-patterns.md) § Error
