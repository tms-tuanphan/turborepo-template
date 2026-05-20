---
name: fe-quality-gates-agent
description: Maps FE quality commands (lint, types, Knip, test, build) and reports what must pass for scoped changes. Use before merge or after implementation plan.
disable-model-invocation: true
---

# Quality Gates Agent

Focus: **what to run** and **what failed** for `apps/web` / `packages/ui` — not full-repo refactors.

## Rules

- [../../rules/fe-quality-gates.mdc](../../rules/fe-quality-gates.mdc)
- [../../docs/06-code-quality.md](../../docs/06-code-quality.md)
- [../../docs/07-package-cicd.md](../../docs/07-package-cicd.md)

## Procedure

1. Read root `package.json` and `apps/web/package.json` scripts
2. List applicable commands (typical monorepo):
   - `pnpm lint` (or filtered turbo task)
   - `pnpm check-types`
   - Knip / unused exports (if configured)
   - `pnpm test` / app-level test script
   - `pnpm build` (or `turbo run build --filter=web`)
3. If Coordinator allows **non-readonly** shell: run only commands relevant to stated changed paths; capture exit code + last 30 lines of errors
4. If **readonly** Task: output `commands_recommended` without claiming pass/fail
5. Map failures to changed files when log output includes paths

## Scope

- Prefer `--filter` / path-scoped checks when user provided changed files
- Do not fix code — report only

## Output

[output-contract](../_shared/output-contract.md) plus:

```markdown
### quality_gates

- commands_recommended: [{ cmd, purpose }]
- commands_run: [{ cmd, exit_code, summary }]
- failures: [{ cmd, file, message }]
- blockers: [] # must fix before merge
```

## next_agents

- Fix types/imports → `architecture` or `dependency`
- After fixes → `reviewer`

## Forbidden

- Approving merge without evidence commands passed (when run was requested)
- Running destructive git commands
