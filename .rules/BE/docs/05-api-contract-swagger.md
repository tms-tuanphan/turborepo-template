# API contract and Swagger

[← Mục lục](./README.md)

---

## Source of truth

- DTOs and response entities → `packages/api`.
- `@ApiProperty` on DTO fields in the same file as validation.
- `apps/api`: `DocumentBuilder`, `SwaggerModule.setup` — no duplicate field defs.

---

## Practices

- `@ApiTags` per resource controller.
- Cookie session (this project): `addCookieAuth('session', { name: AUTH_COOKIE_NAME })` + `@ApiCookieAuth('session')` on protected routes.
- `@ApiBearerAuth` when Authorization header JWT is used instead.
- Document non-default status codes with `@ApiResponse` / `@ApiUnauthorizedResponse`; reuse `ApiErrorPayloadDto`.
- Bootstrap: `apps/api/src/swagger/setup-swagger.ts` from `main.ts`.
- Env: `SWAGGER_ENABLED`, `SWAGGER_PATH` (default `/api/docs`); off in production unless `SWAGGER_ENABLED=true`.

---

## Breaking changes

- Renaming/removing DTO fields or routes → tag `BREAKING_API` escalation.
- **dto** + **reviewer** agents before merge.

Skill: [swagger-openapi](../skills/swagger-openapi/SKILL.md) · Rule: [be-swagger-openapi.mdc](../rules/be-swagger-openapi.mdc) · Agent: [swagger](../agents/swagger/SKILL.md)
