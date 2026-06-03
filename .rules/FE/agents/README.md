# FE sub-agents registry

Cursor-native sub-agents for `apps/web` and `packages/ui`. The main agent acts as **Coordinator**; specialized agents run via **Task tool** with scoped paths.

**Follow guide (start here):** [WORKFLOW.md](./WORKFLOW.md) — tier Small/Medium/Large + checklist từng task  
**Entry:** [coordinator/AGENTS.md](./coordinator/AGENTS.md) — decision tree + **Task recipes for every agent**  
**Output format:** [\_shared/output-contract.md](./_shared/output-contract.md)

## When to use sub-agents

Use the Coordinator flow when the task involves any of:

- Large or cross-cutting FE change
- Performance investigation
- Bug root-cause analysis
- New feature module or screen
- Forms, validation, or Server Actions
- i18n / copy changes (EN + JA)
- Refactor touching import boundaries
- CI / lint / types failures on FE paths

For small, single-file edits, apply [rules/](../rules/) and [skills/](../skills/) directly.

## Complexity tiers (summary)

| Tier       | Discovery                       | Example                        |
| ---------- | ------------------------------- | ------------------------------ |
| **Small**  | ≤1 agent (`feature`)            | Fix one schema / key           |
| **Medium** | ≤3 agents (`feature` + focused) | Filter + search in one feature |
| **Large**  | Full pipeline                   | New admin screen               |

Details: [WORKFLOW.md](./WORKFLOW.md), [coordinator/AGENTS.md](./coordinator/AGENTS.md).

## Agent registry

| Agent                                           | Phase | Read scope                               | Delegates to                                                                                         |
| ----------------------------------------------- | ----- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [coordinator](./coordinator/AGENTS.md)          | —     | Orchestration only                       | All agents below                                                                                     |
| [repo-scanner](./repo-scanner/SKILL.md)         | 1     | `apps/web` structure, `packages/ui`      | —                                                                                                    |
| [architecture](./architecture/SKILL.md)         | 1     | `apps/web/**`, `packages/ui/**`          | [project-architecture](../skills/project-architecture/SKILL.md), docs 01–04                          |
| [dependency](./dependency/SKILL.md)             | 1     | Manifest or explicit roots               | —                                                                                                    |
| [feature](./feature/SKILL.md)                   | 1     | [manifests](./feature/manifests/) only   | docs 04, [fe-import-boundaries](../rules/fe-import-boundaries.mdc)                                   |
| [route](./route/SKILL.md)                       | 1     | `apps/web/app/**`                        | [fe-next-app-router](../rules/fe-next-app-router.mdc)                                                |
| [component](./component/SKILL.md)               | 1     | `**/components/**`, `packages/ui/**`     | [frontend-design](../skills/frontend-design/SKILL.md), [fe-shadcn-ui](../rules/fe-shadcn-ui.mdc)     |
| [state](./state/SKILL.md)                       | 1     | `**/hooks/**`, `**/*-store.ts`           | docs 05                                                                                              |
| [api](./api/SKILL.md)                           | 1     | `**/actions/**`, `app/api/**`            | [auth-patterns](../skills/auth-patterns/SKILL.md), [form-patterns](../skills/form-patterns/SKILL.md) |
| [validation](./validation/SKILL.md)             | 1     | `**/validations/**`, `*.schema.ts`       | [form-patterns](../skills/form-patterns/SKILL.md)                                                    |
| [i18n](./i18n/SKILL.md)                         | 1     | `messages/*`, scoped app/features/shared | [fe-i18n](../rules/fe-i18n.mdc)                                                                      |
| [performance](./performance/SKILL.md)           | 1     | Manifest routes + feature root           | [vercel-react-best-practices](../skills/vercel-react-best-practices/SKILL.md)                        |
| [bug-reproduction](./bug-reproduction/SKILL.md) | 2     | Manifest scope + repro path              | —                                                                                                    |
| [test](./test/SKILL.md)                         | 2     | `publicApi` + behavior under test        | —                                                                                                    |
| [quality-gates](./quality-gates/SKILL.md)       | 2     | `apps/web`, `packages/ui` scripts/CI     | [fe-quality-gates](../rules/fe-quality-gates.mdc), docs 06–07                                        |
| [reviewer](./reviewer/SKILL.md)                 | 2     | **Diff only** — run last                 | rules + [web-design-guidelines](../skills/web-design-guidelines/SKILL.md)                            |

## Typical flows

| Task                            | Tier   | Agent order                                                                                                            |
| ------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------- |
| New admin screen                | Large  | feature [→ scanner] → route ∥ component → api → validation → i18n → implement → test (plan) → quality-gates → reviewer |
| Filter + search (known feature) | Medium | feature → state \| api → implement → quality-gates → reviewer                                                          |
| Filter bug                      | Medium | feature → bug-reproduction → state → quality-gates → reviewer                                                          |
| Slow list page                  | Medium | feature → performance → state → quality-gates → reviewer                                                               |
| PR review                       | —      | i18n (if UI) → quality-gates → reviewer                                                                                |
| Layer violation                 | Large  | architecture → dependency → reviewer                                                                                   |

Full recipes: [coordinator/AGENTS.md](./coordinator/AGENTS.md).

## Feature manifests

Per-feature scope: [feature/manifests/](./feature/manifests/)

| Manifest                                                 | Feature               |
| -------------------------------------------------------- | --------------------- |
| [blogs.json](./feature/manifests/blogs.json)             | Public blogs          |
| [admin-blogs.json](./feature/manifests/admin-blogs.json) | Admin blog CMS        |
| [admin-auth.json](./feature/manifests/admin-auth.json)   | Admin login           |
| [admin-shell.json](./feature/manifests/admin-shell.json) | Admin layout/nav      |
| [admin-users.json](./feature/manifests/admin-users.json) | Admin user management |
| [\_template.json](./feature/manifests/_template.json)    | Copy for new features |

Validate: `pnpm fe:manifest-check` (repo root).

## Glob rules (Cursor)

| Rule                                                          | Topic                        |
| ------------------------------------------------------------- | ---------------------------- |
| [fe-monorepo.mdc](../rules/fe-monorepo.mdc)                   | Monorepo boundaries          |
| [fe-import-boundaries.mdc](../rules/fe-import-boundaries.mdc) | Layer imports                |
| [fe-i18n.mdc](../rules/fe-i18n.mdc)                           | i18n                         |
| [fe-next-app-router.mdc](../rules/fe-next-app-router.mdc)     | App Router                   |
| [fe-shadcn-ui.mdc](../rules/fe-shadcn-ui.mdc)                 | Shadcn / UI package          |
| [fe-quality-gates.mdc](../rules/fe-quality-gates.mdc)         | CI / lint / Knip             |
| [fe-feature-module.mdc](../rules/fe-feature-module.mdc)       | Feature folders & public API |
| [fe-server-actions.mdc](../rules/fe-server-actions.mdc)       | Actions & `app/api`          |
| [fe-services-layer.mdc](../rules/fe-services-layer.mdc)       | HTTP in services             |
| [fe-coding-react.mdc](../rules/fe-coding-react.mdc)           | React / RSC / Query          |
| [fe-coding-typescript.mdc](../rules/fe-coding-typescript.mdc) | TS strict / const            |
| [fe-coding-styling.mdc](../rules/fe-coding-styling.mdc)       | Tailwind / CVA               |
| [fe-performance.mdc](../rules/fe-performance.mdc)             | Perf priority                |
| [fe-security.mdc](../rules/fe-security.mdc)                   | Secrets, auth on mutations   |

## Platform knowledge

Stubs: [../docs/knowledge/README.md](../docs/knowledge/README.md)

## Skills

Deep playbooks: [../skills/](../skills/). Sub-agents **delegate**; they do not duplicate skill content.

**Generators (scaffold):** [../skills/generators/README.md](../skills/generators/README.md) — use for plans/boilerplate; **coordinator** for repo implementation.
