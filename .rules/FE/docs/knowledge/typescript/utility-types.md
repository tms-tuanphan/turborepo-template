# Utility types

**When to use:** Form defaults, partial updates, picking DTO fields.

**Repo pattern:**

- `CreateUserInput` / `UpdateUserInput` derived from Zod `z.infer<typeof schema>`
- Prefer Zod as source of truth over hand-written duplicates

**See also:** [../forms/zod.md](../forms/zod.md)
