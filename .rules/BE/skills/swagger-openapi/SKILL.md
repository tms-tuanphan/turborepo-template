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

- One `DocumentBuilder` in `main.ts`
- `SWAGGER_ENABLED` or non-production guard

## Rule & agent

- [be-swagger-openapi.mdc](../../rules/be-swagger-openapi.mdc)
- Agent: [dto](../../agents/dto/SKILL.md) (core)
