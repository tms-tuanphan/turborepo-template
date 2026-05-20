# API contract workflow

[← Index](./README.md)

---

## `@repo/api` owns

- Request/response DTOs
- HTTP-facing entities
- `I18nKey` constants
- `ApiErrorPayload` type
- Swagger `@ApiProperty` on DTO fields (when used)

## `apps/api` owns

- Controllers, services, modules
- Prisma access (via `@repo/database` when present)
- Mapping persistence → contract types

## `apps/web` owns

- UI, routes, Server Actions
- Zod schemas for forms (align with DTO fields)
- May import types from `@repo/api` in devDependencies

---

## Workflow: add field to existing resource

1. **Contract** — add field to DTO/entity in `packages/api/src/<domain>/`
2. **Build** — `pnpm --filter @repo/api build`
3. **BE** — update service + controller; map DB → entity
4. **FE** — update Zod/form/types if UI exposes field
5. **Gates** — [fullstack-quality-gates](../rules/fullstack-quality-gates.mdc)
6. **Review** — BE reviewer + FE reviewer on respective diffs

---

## Anti-patterns

- Copy DTO into `apps/api/src/**/dto/` for shared endpoints
- Return Prisma model from controller
- Change contract without rebuilding `@repo/api`

Skill: [api-contract-sync](../skills/api-contract-sync/SKILL.md)
