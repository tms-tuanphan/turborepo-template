# Command safety policy (BE sub-agents)

All agents and the Coordinator MUST follow this policy when running shell commands. Quality Gates is the only agent that may recommend or run allowed commands — and only when the user or Coordinator explicitly approves execution.

## Allowed (with user / Coordinator approval)

| Command                         | Purpose                      |
| ------------------------------- | ---------------------------- |
| `pnpm --filter api lint`        | ESLint for Nest app          |
| `pnpm --filter api test`        | Unit tests (Jest)            |
| `pnpm --filter api build`       | Nest compile / wiring errors |
| `pnpm --filter api test:e2e`    | E2E when HTTP flows changed  |
| `pnpm --filter @repo/api build` | Contract package compile     |
| `pnpm build` (repo root, turbo) | CI parity across packages    |

When `packages/database` exists and scripts are defined:

| Command                                             | Purpose                         |
| --------------------------------------------------- | ------------------------------- |
| `pnpm --filter @repo/database exec prisma validate` | Schema syntax only (no migrate) |
| `pnpm --filter @repo/database build`                | If package has build script     |

## Forbidden (all agents, including quality-gates)

| Category             | Examples                                                       |
| -------------------- | -------------------------------------------------------------- |
| Database mutation    | `prisma migrate dev`, `prisma db push`, `prisma migrate reset` |
| Dependency changes   | `pnpm install`, `pnpm add`, `npm install`                      |
| Environment mutation | Editing `.env`, `.env.local`, exporting secrets                |
| Deploy / infra       | `kubectl`, `terraform apply`, docker push to prod              |
| Destructive          | `rm -rf`, `git reset --hard`, force push                       |
| Secrets in output    | Logging tokens, `DATABASE_URL`, API keys                       |

## DB migrations

- Agents MUST NOT run migrations.
- Coordinator escalates `DB_MIGRATION` per [ESCALATION.md](./ESCALATION.md).
- Human runs migrate locally after review.

## Readonly Task mode

When `readonly: true` on Task tool:

- Output `commands_recommended` only — do not claim pass/fail.
- Do not execute shell.

## Quality Gates linkage

[quality-gates/SKILL.md](../quality-gates/SKILL.md) references this file. On failure, report exit code and last ~30 lines of log — do not fix code.
