---
name: be-repo-scanner
description: Scans apps/api, packages/api, packages/database structure for modules, tests, contracts. Extended agent — unknown repo or Large without manifest.
disable-model-invocation: true
---

# Repo Scanner Agent (extended)

Produce a **routing map** for other sub-agents. Structure only — no deep business analysis.

## Scope (only these)

- `apps/api/package.json`, `apps/api/src/` (directory listing)
- `apps/api/src/common/` (top-level)
- `packages/api/package.json`, `packages/api/src/` (top-level domains)
- `packages/database/package.json` if exists
- `apps/api/test/` layout

## Do not

- Read every service implementation
- Propose code changes
- Run shell commands

## Detection checklist

| Field           | How to detect                               |
| --------------- | ------------------------------------------- |
| framework       | NestJS from deps / nest-cli                 |
| modules         | Subdirs of `src/` with `*.module.ts`        |
| contractPackage | `packages/api` exports                      |
| databasePackage | `packages/database` presence                |
| testRoots       | `*.spec.ts` colocated, `test/jest-e2e.json` |

## Output

1. Full [output-contract](../_shared/output-contract.md)
2. Repo Scanner JSON per contract schema

## next_agents

- `module` with manifest id when user named module
- `architecture` if boundaries unclear

## Forbidden

- Code patches
