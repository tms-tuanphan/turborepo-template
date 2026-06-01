# Observability (logging + metrics + tracing)

[← Mục lục](./README.md)

---

## Logging

- Prefer structured JSON logs (Pino/Winston JSON formatter).
- Include correlation id (`requestId`) on every request log.
- Log levels: `error`, `warn`, `info`, `debug`, `trace` (prod defaults to `info+`).

Sensitive data:

- Never log passwords, tokens, secrets, credit card data.
- Mask or omit sensitive fields before logging.

---

## Correlation / request id

- Generate a `requestId` per request (UUID).
- Accept and propagate `X-Request-Id` when present; otherwise create one.

---

## Health checks

- `/health`: liveness (process up)
- `/ready`: readiness (DB/Redis reachable if required)

---

## Metrics

When needed:

- expose Prometheus metrics (request duration, error rate, queue depth)
- dashboard in Grafana

---

## Tracing

For distributed systems:

- OpenTelemetry instrumentation
- export traces to Jaeger (or compatible backend)

---

## Error tracking & alerting

- Sentry (or similar) for error tracking
- alerts for error spikes and critical failures
