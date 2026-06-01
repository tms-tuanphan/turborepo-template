# DevOps (Docker + CI/CD)

[← Mục lục](./README.md)

---

## Docker build

- Use multi-stage Dockerfile:
  - build stage compiles/transpiles
  - runtime stage contains minimal artifacts + prod deps

---

## Local dev stack (docker-compose)

Recommended services for backend development:

- PostgreSQL
- Redis
- BullMQ worker + optional Bull Board
- Mailhog/Mailtrap-compatible SMTP for emails (when auth flows exist)

---

## CI/CD pipeline

Recommended order:

- lint
- unit tests
- build
- integration/e2e (for critical flows)
- image push + deploy (human-approved)

---

## Env validation

- Validate environment variables at bootstrap (schema via Zod/Joi).
- Fail fast with clear error list; never proceed with partially invalid env.

---

## Horizontal scaling

- Keep API stateless.
- Use Redis for shared session/cache/queue state.
- Avoid local filesystem for persistent data.
