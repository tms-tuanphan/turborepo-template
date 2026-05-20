---
name: be-module-agent
description: Maps one NestJS domain module using a JSON manifest. Use when analyzing or changing one module in isolation. Coordinator provides manifest inline or path under manifests/.
disable-model-invocation: true
---

# Module Agent (core)

Analyze **one** Nest module using its manifest. Do not read the full monorepo.

## Input

Coordinator supplies either:

- Path: `.rules/BE/agents/module/manifests/{id}.json`
- Inline JSON with `schemaVersion: 1`

## Allowed reads

Only paths in `scope`:

- `moduleRoot`, `contractRoot`, `controllers`, `services`, `tests`
- `databaseModels` when `packages/database` exists
- Files reachable via imports from those roots (one hop)
- `relatedRules` from manifest

## Forbidden reads

- Paths in `forbiddenRoots`
- Other `apps/api/src/*` modules not in this manifest
- Full `packages/api` tree unless `contractRoot` covers it

## Procedure

1. Verify `schemaVersion === 1`
2. List module files under `moduleRoot` (controller, service, module.ts)
3. List contract under `contractRoot` (dto, entities)
4. Map tests in `scope.tests`
5. Flag cross-module imports violating `forbiddenRoots` or monorepo rules

## Delegate

- [docs/02-project-structure.md](../../docs/02-project-structure.md)
- [rules/be-nestjs-structure.mdc](../../rules/be-nestjs-structure.mdc)
- [rules/be-monorepo.mdc](../../rules/be-monorepo.mdc)
- Skill: [project-architecture](../../skills/project-architecture/SKILL.md)

## Suggest next agents (Coordinator — core-first)

| Manifest / diff contains      | Suggest               |
| ----------------------------- | --------------------- |
| `controllers`                 | controller (extended) |
| `services`                    | service (core)        |
| `contractRoot` / dto          | dto (core)            |
| `databaseModels` non-empty    | prisma (core)         |
| `apps/api/src/common` in diff | common (extended)     |
| Transaction / state rules     | domain (extended)     |

## Output

Follow [../\_shared/output-contract.md](../_shared/output-contract.md).

```markdown
### module_map

- module_id:
- nest_module: []
- controllers: []
- services: []
- contract_files: []
- tests: []
- violations: []
```

## New module checklist

Copy [manifests/\_template.json](./manifests/_template.json), fill scope, run `pnpm be:manifest-check`.
