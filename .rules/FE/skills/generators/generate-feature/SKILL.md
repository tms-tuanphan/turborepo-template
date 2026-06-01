---
name: fe-generate-feature
description: Scaffold a feature module and App Router page wiring. Use with design-feature output; follows 04-feature-module and services layer.
---

# Generate feature

## Creates (checklist)

```bash
mkdir -p apps/web/features/{name}/{components,services,actions,hooks,types,validations}
touch apps/web/features/{name}/index.ts
```

- `app/(...)/{route}/page.tsx` — thin Server Component importing from `@/features/{name}`
- `features/{name}/services/{entity}.service.ts` — HTTP functions
- `features/{name}/validations/{entity}.schema.ts` — Zod
- `features/{name}/index.ts` — public API only

## Rules

- [fe-feature-module.mdc](../../../rules/fe-feature-module.mdc)
- [fe-services-layer.mdc](../../../rules/fe-services-layer.mdc)
- [fe-next-app-router.mdc](../../../rules/fe-next-app-router.mdc)
- Add manifest: `agents/feature/manifests/{name}.json` from `_template.json`

## Sub-generators

| Need              | Skill                                                    |
| ----------------- | -------------------------------------------------------- |
| Forms             | [generate-form](../generate-form/SKILL.md)               |
| Table list        | [generate-table](../generate-table/SKILL.md)             |
| API layer         | [generate-service](../generate-service/SKILL.md)         |
| Client list cache | [generate-query-hooks](../generate-query-hooks/SKILL.md) |

## Output

File tree + minimal stub code per file (names only if user asked plan-only).
