# Production and hardening

[← Mục lục](./README.md)

---

## Principles

- **KISS:** request → validate → service → DB → response.
- **YAGNI:** No unused abstractions.
- **DRY:** Shared guards, pipes, mappers.

---

## API & security

- RESTful resources; correct status codes.
- DTO for body/query — no raw `req.query` everywhere.
- Auth from token/session — not body user id.
- Secrets in env only; helmet/CORS explicit.
- Rate limiting on public APIs.

---

## Errors & reliability

- Unified exception filter; stable error `code` for clients.
- Timeouts on outbound HTTP; short DB transactions.
- Map Prisma errors; no silent catch.

---

## Observability

- Structured JSON logs + `requestId` / correlation id.
- `/health` for liveness; readiness when DB required.
- No sensitive payloads in logs.

---

## Performance

- Pagination ceilings on lists.
- Avoid N+1 (see [04-prisma-database.md](./04-prisma-database.md)).
- Cache only with measured need + invalidation plan.

---

## Config

- Validated env at bootstrap (`ConfigModule` + schema).
- No hardcoded URLs per environment.

---

## Agents

- **production** (extended): readonly audit only.
- Escalation: `PROD_CONFIG`, `SECURITY_RISK`.

Skill: [production-hardening](../skills/production-hardening/SKILL.md) · Rule: [be-production.mdc](../rules/be-production.mdc)
