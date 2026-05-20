---
name: shared-api-contract-sync
description: Sync @repo/api contract changes across packages/api, apps/api, and apps/web consumers. Use when adding or changing DTOs, entities, or shared types.
---

# API contract sync

> Docs: [docs/02-api-contract.md](../../docs/02-api-contract.md)  
> Rules: [api-contract.mdc](../../rules/api-contract.mdc), [fullstack-quality-gates.mdc](../../rules/fullstack-quality-gates.mdc)

## Checklist

1. **Identify contract root** — `packages/api/src/<domain>/`
2. **Edit DTOs/entities** — add `@ApiProperty` + validators if BE uses class-validator
3. **Build contract** — `pnpm --filter @repo/api build`
4. **BE** — update service mapping; controller params; specs with factories
5. **FE** — update Zod schemas, forms, types importing from `@repo/api` if any
6. **Breaking?** — tag `BREAKING_API`; list consumers
7. **Gates** — api build → api test/build → web check-types/build → root build optional
8. **Review** — BE reviewer on api diff; FE reviewer on web diff

## Do not

- Duplicate DTO in `apps/api` for shared endpoints
- Skip `@repo/api` build after contract change
- Return Prisma types on HTTP boundary

## Cross mapping

If domain has [mappings/](../../mappings/) entry, read `feFeatureManifest` + `beModuleManifest` for scope.
