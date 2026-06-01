# Queue (BullMQ)

[← Mục lục](./README.md)

---

## When to use a queue

Use queue for:

- sending email
- export/import files
- image processing (thumbnail)
- webhook delivery/retry
- any task that can exceed request timeout or requires retries

Avoid running these inside HTTP requests.

---

## HTTP contract

Recommended:

- enqueue job → return `202 Accepted` with `{ jobId }` (or a consistent DTO).

---

## Reliability

- Retries: 3–5 with exponential backoff.
- Ensure jobs are idempotent (especially if retrying).
- Dead-letter queue (DLQ) / failure handling:
  - keep failure reason (sanitized)
  - alert on high failure rate

---

## Monitoring

- Bull Board (or similar) for operational visibility.
- Metrics/exporter for queue depth, processing time, failure rates when needed.
