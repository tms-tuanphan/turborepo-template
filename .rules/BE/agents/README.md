# BE sub-agents registry

Cursor-native sub-agents for `apps/api`, `packages/api`, and `packages/database`. The main agent acts as **Coordinator**; specialists run via **Task tool** with scoped paths.

**Start here:** [WORKFLOW.md](./WORKFLOW.md) — tier Small/Medium/Large + governance  
**Entry:** [coordinator/AGENTS.md](./coordinator/AGENTS.md) — decision tree + Task recipes  
**Output:** [\_shared/output-contract.md](./_shared/output-contract.md)  
**Governance:** [COMMAND_POLICY.md](./_shared/COMMAND_POLICY.md), [ESCALATION.md](./_shared/ESCALATION.md)

## When to use sub-agents

Use the Coordinator flow when the task involves any of:

- New or changed Nest module / HTTP endpoint
- Prisma schema or persistence changes
- DTO / OpenAPI contract changes
- Bug root-cause (5xx, validation, transaction)
- Import boundary violations (`apps/api` ↔ `packages/api`)
- CI failures on BE paths
- Production hardening / config review

For small, single-file edits, apply [../backend-rules-index.mdc](../backend-rules-index.mdc) and relevant `.mdc` files directly.

## Core vs Extended

Coordinator spawns **Core** by default. **Extended** only when decision tree, escalation, user request, or `next_agents` — within budgets (`max_depth: 2`, `max_extended_per_task: 3`).

### Core agents (default)

| Agent                                     | Role                                       |
| ----------------------------------------- | ------------------------------------------ |
| [module](./module/SKILL.md)               | Scope via [manifests](./module/manifests/) |
| [service](./service/SKILL.md)             | Application orchestration                  |
| [dto](./dto/SKILL.md)                     | Contract + Swagger                         |
| [prisma](./prisma/SKILL.md)               | Persistence (`packages/database`)          |
| [quality-gates](./quality-gates/SKILL.md) | lint / test / build                        |
| [reviewer](./reviewer/SKILL.md)           | **Last** — diff + severity                 |

### Extended agents (on demand)

| Agent                                           | Trigger                                        |
| ----------------------------------------------- | ---------------------------------------------- |
| [repo-scanner](./repo-scanner/SKILL.md)         | Unknown repo / Large without manifest          |
| [architecture](./architecture/SKILL.md)         | Boundary refactor / violation                  |
| [dependency](./dependency/SKILL.md)             | Import graph / coupling                        |
| [controller](./controller/SKILL.md)             | HTTP layer in diff                             |
| [common](./common/SKILL.md)                     | `apps/api/src/common/**`                       |
| [domain](./domain/SKILL.md)                     | Transactions, state machine, pagination policy |
| [i18n](./i18n/SKILL.md)                         | Message keys / errors                          |
| [performance](./performance/SKILL.md)           | Slow API — **diagnose only**                   |
| [bug-reproduction](./bug-reproduction/SKILL.md) | Bug reports — structured repro                 |
| [test](./test/SKILL.md)                         | Test plan / factories                          |
| [production](./production/SKILL.md)             | Deploy / config — **readonly**                 |

## Complexity tiers

| Tier       | Discovery max | Extended cap |
| ---------- | ------------- | ------------ |
| **Small**  | 1 (`module`)  | 0            |
| **Medium** | 3             | ≤1           |
| **Large**  | 6             | ≤3           |

Details: [WORKFLOW.md](./WORKFLOW.md), [coordinator/AGENTS.md](./coordinator/AGENTS.md).

## Typical flows

| Task                | Tier   | Order                                                                          |
| ------------------- | ------ | ------------------------------------------------------------------------------ |
| Field mới Links API | Medium | module → dto → service → quality-gates → reviewer                              |
| Endpoint + DB       | Large  | module → prisma → dto → service → controller → test → quality-gates → reviewer |
| Bug 500             | Medium | module → bug-reproduction → service \| prisma → quality-gates → reviewer       |
| Slow API            | Medium | module → performance → prisma \| service → reviewer                            |
| PR review           | —      | quality-gates → reviewer                                                       |
| Boundary violation  | Large  | architecture → dependency → reviewer                                           |
| Deploy / hardening  | Medium | production (readonly) → reviewer                                               |

## Module manifests

[module/manifests/](./module/manifests/)

| Manifest                                             | Module               |
| ---------------------------------------------------- | -------------------- |
| [links.json](./module/manifests/links.json)          | Links API            |
| [app.json](./module/manifests/app.json)              | App root controller  |
| [\_template.json](./module/manifests/_template.json) | Copy for new modules |

Validate: `pnpm be:manifest-check` (repo root).

## Rules, docs, skills

| Layer              | Path                                |
| ------------------ | ----------------------------------- |
| Rules (glob, ngắn) | [rules/](../rules/)                 |
| Docs (chi tiết)    | [docs/README.md](../docs/README.md) |
| Skills (playbooks) | [skills/](../skills/)               |

Index: [backend-rules-index.mdc](../backend-rules-index.mdc)

Sub-agents **delegate** to rules/docs/skills — they do not duplicate full content.
