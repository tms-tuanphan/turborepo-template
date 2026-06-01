# Backend documentation (NestJS + Turborepo)

> Kiến trúc và pattern cho `apps/api`, `packages/api`, `packages/database`.  
> **Fullstack:** [shared docs](../../shared/docs/README.md) — contract với `apps/web`  
> Rules: [../rules/](../rules/) — Skills: [../skills/](../skills/) — Agents: [../agents/README.md](../agents/README.md)

---

## Mục lục

| File                                                                               | Nội dung                                                          |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [00-checklist-coverage.md](./00-checklist-coverage.md)                             | Coverage checklist 1–19 ↔ rules/docs/skills                      |
| [01-architecture.md](./01-architecture.md)                                         | Boundary 3 package + layer model                                  |
| [02-project-structure.md](./02-project-structure.md)                               | Cấu trúc thư mục `apps/api`, `packages/api`, test                 |
| [03-layering-and-patterns.md](./03-layering-and-patterns.md)                       | Business, mapping, transaction, errors, pagination, state machine |
| [04-prisma-database.md](./04-prisma-database.md)                                   | Prisma monorepo, schema, query, Nest inject                       |
| [05-api-contract-swagger.md](./05-api-contract-swagger.md)                         | DTO, OpenAPI, `@nestjs/swagger`                                   |
| [06-testing.md](./06-testing.md)                                                   | AAA, factory, typed mocks, pyramid                                |
| [07-i18n.md](./07-i18n.md)                                                         | Message keys, locale, validation errors                           |
| [08-production.md](./08-production.md)                                             | Security, observability, config, reliability                      |
| [09-monorepo-and-commands.md](./09-monorepo-and-commands.md)                       | Workspace layout, pnpm/turbo, thêm package                        |
| [10-api-design.md](./10-api-design.md)                                             | REST, versioning, idempotency, structured errors                  |
| [11-validation-and-dto.md](./11-validation-and-dto.md)                             | ValidationPipe, DTO boundaries, response shaping                  |
| [12-authentication-and-authorization.md](./12-authentication-and-authorization.md) | JWT, rotation, guards, ownership, policy-based authz              |
| [13-security.md](./13-security.md)                                                 | Secrets, helmet/CORS, rate limiting, audit logs                   |
| [14-caching.md](./14-caching.md)                                                   | Redis caching + invalidation patterns                             |
| [15-queue-bullmq.md](./15-queue-bullmq.md)                                         | BullMQ, retries/backoff, DLQ, monitoring                          |
| [16-event-driven.md](./16-event-driven.md)                                         | Domain events, outbox pattern, saga notes                         |
| [17-file-upload.md](./17-file-upload.md)                                           | S3/R2, signed URL, validators, virus scan                         |
| [18-observability.md](./18-observability.md)                                       | Logging, requestId, health, metrics, tracing, Sentry              |
| [19-devops.md](./19-devops.md)                                                     | Docker, compose dev stack, CI/CD, env validation                  |
| [20-performance.md](./20-performance.md)                                           | Pagination, batching, pool sizing, streaming, load test           |

---

## Quick start

1. [01-architecture.md](./01-architecture.md) — hiểu `apps/api` vs `packages/api` vs `packages/database`
2. [02-project-structure.md](./02-project-structure.md) — đặt file đúng chỗ
3. [03-layering-and-patterns.md](./03-layering-and-patterns.md) — controller / service / domain / prisma

### Khi code

- Contract / Swagger → [05-api-contract-swagger.md](./05-api-contract-swagger.md)
- DB / migrate → [04-prisma-database.md](./04-prisma-database.md) + human chạy migrate ([ESCALATION](../agents/_shared/ESCALATION.md))
- Test → [06-testing.md](./06-testing.md)
- Task phức tạp → [agents/WORKFLOW.md](../agents/WORKFLOW.md)
