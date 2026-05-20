---
name: be-swagger-openapi
description: OpenAPI with @nestjs/swagger — DTO metadata in packages/api, DocumentBuilder in apps/api. Use when documenting HTTP APIs.
---

# Swagger / OpenAPI

> Full doc: [docs/05-api-contract-swagger.md](../../docs/05-api-contract-swagger.md)

## DTO (packages/api)

```typescript
export class CreateLinkDto {
  @ApiProperty({ example: 'https://example.com' })
  @IsUrl()
  url: string;
}
```

## Controller (apps/api)

```typescript
@ApiTags('Links')
@Controller('links')
export class LinksController { ... }
```

## Bootstrap

- `setupSwagger(app)` in `apps/api/src/swagger/setup-swagger.ts`, called from `main.ts`
- `SWAGGER_ENABLED` / `SWAGGER_PATH`; default enabled when `NODE_ENV !== 'production'`

## Rule & agents

- [be-swagger-openapi.mdc](../../rules/be-swagger-openapi.mdc)
- **swagger** (extended): audit + implementation checklist — [agents/swagger/SKILL.md](../../agents/swagger/SKILL.md)
- **dto** (core): contract shape; tag `swagger_gaps` → spawn **swagger**
