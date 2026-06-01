# Server Actions for reads

**When to use:** Simple reads consumed by client hooks or progressive enhancement.

**Repo pattern:** Thin `getXAction` delegating to `services/` — same as writes.

**Prefer:** Async Server Component fetch for initial page data when no client cache needed.
