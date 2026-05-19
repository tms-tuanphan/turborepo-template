---
name: fe-repo-scanner
description: Scans apps/web and packages/ui structure for framework, features, routes, auth, i18n. Use at start of complex FE tasks or when repo layout is unknown.
disable-model-invocation: true
---

# Repo Scanner Agent

Produce a **routing map** for other sub-agents. Read structure only — no deep file analysis.

## Scope (only these)

- `apps/web/package.json`
- `apps/web/app/` (directory listing + key layouts, not every page body)
- `apps/web/features/` (folder names + `index.ts` exports if present)
- `apps/web/shared/`, `apps/web/core/` (top-level structure)
- `apps/web/messages/`
- `apps/web/auth.ts` (exists + provider hint)
- `packages/ui/package.json` and top-level exports

## Do not

- Read every component implementation
- Infer business logic not visible in structure
- Propose code changes

## Detection checklist

| Field           | How to detect                                 |
| --------------- | --------------------------------------------- |
| framework       | Next.js from package.json / app dir           |
| features        | Subdirs of `features/` with `index.ts`        |
| auth            | `next-auth`, `auth.ts`, `app/api/auth`        |
| i18n            | `messages/*.json`, `[locale]` segments        |
| stateManagement | zustand/redux/jotai in deps; else hooks/local |
| ui              | `@repo/ui`, `components/ui`                   |

## Output

1. Full [output-contract](../_shared/output-contract.md) sections
2. JSON block per contract **Repo Scanner schema**

## next_agents

Suggest: `architecture` if boundaries unclear; `feature` with manifest id if user named a feature.
