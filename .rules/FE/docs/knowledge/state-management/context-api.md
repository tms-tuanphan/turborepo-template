# Context API

**When to use:** Providers wrapping a subtree (theme, multi-step wizard).

**Repo pattern:** `core/components/providers.tsx` composes Query + Theme providers.

**Avoid:** App-wide Context for frequently changing data — prefer Zustand or URL.
