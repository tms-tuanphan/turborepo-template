# Performance guidelines

[← Mục lục](./README.md)

---

## Pagination

- All list endpoints must paginate.
- Prefer cursor-based pagination for very large datasets.
- Enforce a maximum `pageSize` to protect DB and memory.

---

## Query efficiency

- Avoid querying in loops (N queries for N items).
- Use batching (`IN`) and properly shaped queries (`select`/`include`).
- Keep `select` minimal; never `SELECT *` by default.

---

## Connection pool sizing

Guideline:

- Review pool sizing when scaling horizontally.
- Ensure pool sizes consider the number of instances and DB limits.

---

## Streaming

For large payloads (exports):

- stream responses instead of building large arrays/buffers in memory
- consider background jobs (queue) when work is heavy

---

## Load testing (pre-release)

- Run load tests (k6/artillery) before release for endpoints expected to be hot.
- Measure P95 latency and error rates; tune queries and caching based on evidence.
