---
name: be-quality-gates-agent
description: Maps BE quality commands and reports pass/fail for scoped changes. Core agent. Follows COMMAND_POLICY.
disable-model-invocation: true
---

# Quality Gates Agent (core)

Focus: **what to run** and **what failed** for `apps/api` / `packages/api` — not refactors.

## Policy

[MANDATORY: ../\_shared/COMMAND_POLICY.md](../_shared/COMMAND_POLICY.md)

Rule: [be-quality-gates.mdc](../../rules/be-quality-gates.mdc) · Doc: [docs/09-monorepo-and-commands.md](../../docs/09-monorepo-and-commands.md)

## Command priority

Read `apps/api/package.json`, `packages/api/package.json`, root `package.json`.

| Priority            | Command                         | When required                  |
| ------------------- | ------------------------------- | ------------------------------ |
| Required            | `pnpm --filter api lint`        | Most TS changes                |
| Required            | `pnpm --filter api test`        | service/controller/spec        |
| Required            | `pnpm --filter api build`       | module wiring, bootstrap, main |
| If HTTP changed     | `pnpm --filter api test:e2e`    | optional but recommended       |
| If contract changed | `pnpm --filter @repo/api build` | DTO/package compile            |
| CI parity           | `pnpm build` (turbo)            | cross-package changes          |

When `packages/database` exists and schema changed: recommend human run migrate — **do not execute**.

## Procedure

1. Read package scripts
2. Map changed paths → required commands
3. If Coordinator allows non-readonly shell: run allowed commands only; capture exit code + last ~30 lines on failure
4. If readonly Task: `commands_recommended` with `required: true|false` — do not claim pass/fail
5. Map failures to files when logs include paths

## Scope

- Prefer `--filter api` for app work
- Do not fix code — report only

## Output

[../\_shared/output-contract.md](../_shared/output-contract.md) plus:

```markdown
### quality_gates

- commands_recommended: [{ cmd, purpose, required }]
- commands_run: [{ cmd, exit_code, summary }]
- failures: [{ cmd, file, message }]
- blockers: []
```

## next_agents

- Import/type issues → `dependency` or `architecture`
- After fixes → `reviewer`

## Forbidden

- Forbidden commands in COMMAND_POLICY
- Approving merge without evidence when run was requested
