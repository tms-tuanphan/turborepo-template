# FE sub-agents registry

Cursor-native sub-agents for `apps/web` and `packages/ui`. The main agent acts as **Coordinator**; specialized agents run via **Task tool** (`explore` / `generalPurpose`, `readonly: true`) with scoped paths.

**Entry:** [coordinator/AGENTS.md](./coordinator/AGENTS.md)  
**Output format:** [\_shared/output-contract.md](./_shared/output-contract.md)

## When to use sub-agents

Use the Coordinator flow when the task involves any of:

- Large or cross-cutting FE change
- Performance investigation
- Bug root-cause analysis
- New feature module
- Refactor touching import boundaries or layers

For small, single-file edits, apply [rules/](../rules/) and [skills/](../skills/) directly.

## Agent registry

| Agent                                           | Phase | Read scope                                   | Delegates to                                                                                                                 |
| ----------------------------------------------- | ----- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [coordinator](./coordinator/AGENTS.md)          | 1     | None (orchestration only)                    | —                                                                                                                            |
| [repo-scanner](./repo-scanner/SKILL.md)         | 1     | `apps/web` tree, `packages/ui`, package.json | —                                                                                                                            |
| [architecture](./architecture/SKILL.md)         | 1     | `apps/web/**`, `packages/ui/**`              | [project-architecture](../skills/project-architecture/SKILL.md), docs 01–04                                                  |
| [dependency](./dependency/SKILL.md)             | 1     | Manifest or feature scope only               | —                                                                                                                            |
| [route](./route/SKILL.md)                       | 1     | `apps/web/app/**`                            | [fe-next-app-router](../rules/fe-next-app-router.mdc)                                                                        |
| [component](./component/SKILL.md)               | 1     | `**/components/**`, `packages/ui/**`         | [frontend-design](../skills/frontend-design/SKILL.md), [fe-shadcn-ui](../rules/fe-shadcn-ui.mdc)                             |
| [state](./state/SKILL.md)                       | 1     | `**/hooks/**`, `**/*-store.ts`               | docs 05                                                                                                                      |
| [api](./api/SKILL.md)                           | 1     | `**/actions/**`, `app/api/**`                | [auth-patterns](../skills/auth-patterns/SKILL.md), [form-patterns](../skills/form-patterns/SKILL.md)                         |
| [performance](./performance/SKILL.md)           | 1     | Scoped feature or route                      | [vercel-react-best-practices](../skills/vercel-react-best-practices/SKILL.md)                                                |
| [feature](./feature/SKILL.md)                   | 1     | [manifests](./feature/manifests/) only       | docs 04                                                                                                                      |
| [bug-reproduction](./bug-reproduction/SKILL.md) | 2     | Manifest scope + repro path                  | —                                                                                                                            |
| [test](./test/SKILL.md)                         | 2     | Public API + behavior under test             | —                                                                                                                            |
| [reviewer](./reviewer/SKILL.md)                 | 2     | Patch + evidence paths only                  | [web-design-guidelines](../skills/web-design-guidelines/SKILL.md), [fe-import-boundaries](../rules/fe-import-boundaries.mdc) |

## Feature manifests (hybrid)

One [feature/SKILL.md](./feature/SKILL.md); per-feature scope in [feature/manifests/](./feature/manifests/):

| Manifest                                                 | Feature               |
| -------------------------------------------------------- | --------------------- |
| [blogs.json](./feature/manifests/blogs.json)             | Public blogs          |
| [admin-blogs.json](./feature/manifests/admin-blogs.json) | Admin blog CMS        |
| [admin-auth.json](./feature/manifests/admin-auth.json)   | Admin login           |
| [admin-shell.json](./feature/manifests/admin-shell.json) | Admin layout/nav      |
| [\_template.json](./feature/manifests/_template.json)    | Copy for new features |

Validate manifests: `pnpm fe:manifest-check` (repo root).

## Split rules (glob-triggered)

| Rule                                                          | Path                |
| ------------------------------------------------------------- | ------------------- |
| [fe-monorepo.mdc](../rules/fe-monorepo.mdc)                   | Monorepo boundaries |
| [fe-import-boundaries.mdc](../rules/fe-import-boundaries.mdc) | Layer imports       |
| [fe-i18n.mdc](../rules/fe-i18n.mdc)                           | i18n                |
| [fe-next-app-router.mdc](../rules/fe-next-app-router.mdc)     | App Router          |
| [fe-shadcn-ui.mdc](../rules/fe-shadcn-ui.mdc)                 | Shadcn / UI package |
| [fe-quality-gates.mdc](../rules/fe-quality-gates.mdc)         | CI / lint / Knip    |

## Skills index (unchanged)

Deep playbooks remain in [../skills/](../skills/). Sub-agents **delegate**; they do not duplicate skill content.
