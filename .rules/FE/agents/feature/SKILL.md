---
name: fe-feature-agent
description: Maps a single apps/web feature module using a JSON manifest. Use when analyzing or changing one feature in isolation. Coordinator provides manifest inline or path under manifests/.
disable-model-invocation: true
---

# Feature Agent (hybrid)

Analyze **one** feature using its manifest. Do not read the full monorepo.

## Input

Coordinator supplies either:

- Path: `.rules/FE/agents/feature/manifests/{id}.json`
- Inline JSON matching manifest schema

## Allowed reads

Only paths listed in `scope`:

- `featureRoot`, `publicApi`, `routes`, `apiRoutes`
- Files reachable via imports from those roots (one hop at a time)
- `relatedDocs` from manifest

## Forbidden reads

- Any path in `forbiddenRoots`
- Other `apps/web/features/*` not in this manifest
- Entire `apps/web/app` tree unless `scope.routes` / `scope.apiRoutes` match

## Procedure

1. Read `publicApi` (`index.ts`) — list exported surface
2. List components, hooks, actions, validations under `featureRoot`
3. Map route entrypoints under `scope.routes`
4. Note Server Actions / API routes under `scope.apiRoutes`
5. Flag cross-feature imports (violation)

## Delegate

- Layer rules: [../../docs/04-feature-module.md](../../docs/04-feature-module.md)
- Import boundaries: [../../rules/fe-import-boundaries.mdc](../../rules/fe-import-boundaries.mdc)
- Feature layout: [../../rules/fe-feature-module.mdc](../../rules/fe-feature-module.mdc)

## Suggest next agents (Coordinator)

| Manifest contains                   | Suggest         |
| ----------------------------------- | --------------- |
| `scope.routes`                      | route           |
| `components/` under featureRoot     | component       |
| `scope.serverActions` or `actions/` | api, validation |
| `validations/`                      | validation      |
| User-facing UI                      | i18n            |
| `hooks/` or filters                 | state           |

## Output

Follow [../\_shared/output-contract.md](../_shared/output-contract.md).

Include:

```markdown
### feature_map

- entry_routes: []
- public_exports: []
- components: []
- hooks: []
- actions: []
- api_routes: []
- violations: []
```

## New feature checklist

Copy [manifests/\_template.json](./manifests/_template.json), fill scope, run `pnpm fe:manifest-check`.
