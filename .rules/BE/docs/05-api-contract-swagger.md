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
- `@ApiBearerAuth` when JWT used.
- Document non-default status codes with `@ApiResponse`.
- Swagger off in production unless explicitly enabled via env.

---

## Breaking changes

- Renaming/removing DTO fields or routes → tag `BREAKING_API` escalation.
- **dto** + **reviewer** agents before merge.

Skill: [swagger-openapi](../skills/swagger-openapi/SKILL.md) · Rule: [be-swagger-openapi.mdc](../rules/be-swagger-openapi.mdc)
