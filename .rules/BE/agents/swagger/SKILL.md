---
name: be-swagger-agent
description: Audits and implements OpenAPI — DTO @ApiProperty in packages/api, controller decorators and bootstrap in apps/api. Extended agent.
disable-model-invocation: true
---

# Swagger Agent (extended)

Focus: **OpenAPI completeness** across contract (`packages/api`) and HTTP surface (`apps/api`). Complements **dto** (shape/validation) and **controller** (routing/guards).

## When Coordinator spawns this agent

| Trigger                                              | Tier                 |
| ---------------------------------------------------- | -------------------- |
| User asks for Swagger / OpenAPI / API docs           | Medium               |
| New module or endpoint without `@Api*` metadata      | Medium               |
| `swagger_gaps` from **dto** or **controller** agents | Medium               |
| PR touches controllers/DTOs but no OpenAPI diff      | Medium (review-only) |

Do **not** spawn for trivial typo fixes with no HTTP contract impact.

## Scope

From manifest (when present):

- `scope.contractRoot` — DTOs, response entities, shared error schemas
- `scope.controllers` — `@ApiTags`, operations, responses, auth scheme
- `apps/api/src/main.ts` and `apps/api/src/swagger/**` — bootstrap only

Without manifest: user-provided paths under `packages/api` and `apps/api` only.

## Delegate (read before acting)

- [docs/05-api-contract-swagger.md](../../docs/05-api-contract-swagger.md)
- [rules/be-swagger-openapi.mdc](../../rules/be-swagger-openapi.mdc)
- [skills/swagger-openapi/SKILL.md](../../skills/swagger-openapi/SKILL.md)
- [../../../shared/rules/api-contract.mdc](../../../shared/rules/api-contract.mdc)
- **dto** agent for breaking field renames → `BREAKING_API`

## Implementation checklist (Coordinator applies after audit)

### 1. Dependencies

- `@nestjs/swagger` in `apps/api`
- `@nestjs/swagger` in `packages/api` (for `@ApiProperty` on DTOs)

### 2. Bootstrap (`apps/api`)

- `setupSwagger(app)` in `src/swagger/setup-swagger.ts`
- Env: `SWAGGER_ENABLED` (default on when `NODE_ENV !== 'production'`), `SWAGGER_PATH` (default `/api/docs`)
- `DocumentBuilder`: title, version, `addBearerAuth` **or** `addCookieAuth` per project auth
- `SwaggerModule.setup(path, app, document)`

### 3. DTOs (`packages/api`)

Every public request/response class:

```typescript
@ApiProperty({ example: 'admin@example.com', format: 'email' })
email!: string;
```

- `example` on every field; `enum` for unions; `required: false` for optionals
- No duplicate field defs in `apps/api`
- Sensitive fields never on response DTOs (`password`, tokens)

### 4. Controllers (`apps/api`)

```typescript
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  ...
}
```

- One `@ApiTags` per resource controller
- `@ApiBearerAuth()` or `@ApiCookieAuth(name)` on protected routes (match real auth)
- Document non-2xx with `@ApiResponse` / `@ApiUnauthorizedResponse` / `@ApiForbiddenResponse`
- Cookie/session flows: document `Set-Cookie` in operation description when relevant

### 5. Shared errors

- Reuse `ApiErrorPayloadDto` (or project equivalent) in `@ApiResponse` for 4xx/5xx

### 6. Production

- Swagger disabled in production unless `SWAGGER_ENABLED=true` explicitly set

## Audit checklist (readonly Task)

- [ ] `setupSwagger` exists and guarded by env
- [ ] All manifest `controllers` have `@ApiTags`
- [ ] Each route has `@ApiOperation` + success `@Api*Response`
- [ ] Auth scheme matches JWT cookie vs Bearer
- [ ] DTOs in `contractRoot` have `@ApiProperty` on every public field
- [ ] No Prisma types exposed in OpenAPI schemas
- [ ] `packages/api` builds with swagger peer dep

## Output

[../\_shared/output-contract.md](../_shared/output-contract.md) plus:

```markdown
### swagger_audit

- bootstrap: { configured: boolean, path: string | null, production_guard: boolean }
- controllers: [{ file, tags: string | null, routes_missing_operation: string[] }]
- dtos: [{ file, class, fields_missing_api_property: string[] }]
- auth_scheme: cookie | bearer | none | mismatch
- gaps: [{ path, issue, suggested_fix }]
- breaking_changes: []
```

## next_agents

- Contract shape / validation → `dto`
- HTTP wiring only → `controller`
- Bootstrap / env in prod → `production` (readonly)
- Final pass → `reviewer`

## Forbidden (readonly Task mode)

- Code patches
- Enabling Swagger in production without escalation `PROD_CONFIG`

## Allowed (when user explicitly requests implementation in same task)

Coordinator (not readonly Task) may implement per checklist above, then run **quality-gates** → **reviewer**.
