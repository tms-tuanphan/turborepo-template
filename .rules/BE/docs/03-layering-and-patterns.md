# Layering and patterns

[← Mục lục](./README.md) · [01-architecture](./01-architecture.md)

---

## Business logic

- **Service layer** owns application orchestration and calls persistence.
- **Not** in controller, DTO, or Prisma queries as “hidden rules”.
- Domain invariants (state machine, atomic multi-step rules) → explicit methods or **domain** agent scope.

---

## Mapping

- Never return raw Prisma models on HTTP.
- Map to `@repo/api` entities/DTOs explicitly.
- Do not leak sensitive or internal fields.

---

## Transactions

- Multi-step DB in one use case → `prisma.$transaction`.
- No scattered awaits for dependent updates without atomicity when failure leaves bad state.

---

## Errors

- Use Nest `HttpException` subclasses — not `throw new Error(...)`.
- Map Prisma errors centrally where repeated.
- No stack / internal DB messages to clients.

---

## Pagination & lists

- List APIs: pagination + sort; filters when product needs them.
- No unbounded full-table returns.
- Default/max limits from DTO + constants — not magic numbers in services.

---

## State machines

- Transitions via named service methods (`activateX()`, `archiveX()`).
- No arbitrary status jumps or scattered `update({ status })`.

---

## Module isolation

- No cross-import of another module’s internal files.
- Use `XxxModule` exports + inject `XxxService`.

---

## No hidden magic

- Business logic readable in **service** — not in decorators/interceptors/Prisma middleware (except cross-cutting).

---

## Single responsibility

- One service per bounded context — no god service across domains.

---

## Decision guide

| Concern                   | Location              |
| ------------------------- | --------------------- |
| Request/response contract | `packages/api`        |
| Guards, filters, pipes    | `apps/api/src/common` |
| DB schema / client        | `packages/database`   |
| Use-case flow             | `apps/api` service    |

---

## Anti-patterns

- God module/service
- Domain logic in `common/`
- Duplicate DTOs app vs package
- List without pagination
- `throw Error` for API failures
- Cross-feature `../other-module/` imports

Skill: [project-architecture](../skills/project-architecture/SKILL.md)
