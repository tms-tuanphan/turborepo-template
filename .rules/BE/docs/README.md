# Backend documentation (NestJS + Turborepo)

> Kiến trúc và pattern cho `apps/api`, `packages/api`, `packages/database`.  
> Rules ngắn (glob): [../rules/](../rules/) — Playbooks: [../skills/](../skills/) — Sub-agents: [../agents/README.md](../agents/README.md)

---

## Mục lục

| File                                                         | Nội dung                                                          |
| ------------------------------------------------------------ | ----------------------------------------------------------------- |
| [01-architecture.md](./01-architecture.md)                   | Boundary 3 package + layer model                                  |
| [02-project-structure.md](./02-project-structure.md)         | Cấu trúc thư mục `apps/api`, `packages/api`, test                 |
| [03-layering-and-patterns.md](./03-layering-and-patterns.md) | Business, mapping, transaction, errors, pagination, state machine |
| [04-prisma-database.md](./04-prisma-database.md)             | Prisma monorepo, schema, query, Nest inject                       |
| [05-api-contract-swagger.md](./05-api-contract-swagger.md)   | DTO, OpenAPI, `@nestjs/swagger`                                   |
| [06-testing.md](./06-testing.md)                             | AAA, factory, typed mocks, pyramid                                |
| [07-i18n.md](./07-i18n.md)                                   | Message keys, locale, validation errors                           |
| [08-production.md](./08-production.md)                       | Security, observability, config, reliability                      |
| [09-monorepo-and-commands.md](./09-monorepo-and-commands.md) | Workspace layout, pnpm/turbo, thêm package                        |

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
