# Caching (Redis)

[← Mục lục](./README.md)

---

## When to cache

Cache is recommended for:

- read-heavy endpoints (`GET`) with repeated access patterns
- expensive computations that are deterministic

Avoid caching when:

- data is highly volatile and invalidation is hard
- correctness must be immediate and cache consistency is not guaranteed

---

## Core rules

- Every cache entry must have a TTL.
- Every write path must either:
  - invalidate affected cache keys, or
  - update cache to the new value.
- Never rely on in-memory cache in multi-instance deployments for shared correctness.

---

## Patterns

- Cache-aside (recommended default):
  - read: cache miss → load from DB → write to cache → return
  - write: write DB → invalidate cache
- Write-through:
  - write DB + cache together (simpler reads, more write coupling)
- Write-behind:
  - cache first then async persist (only when eventual consistency is acceptable)
