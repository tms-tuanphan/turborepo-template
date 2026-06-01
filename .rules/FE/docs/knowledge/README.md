# Platform Knowledge

Stubs for a **Senior Next.js Agent** knowledge layer. Each file is short: when to use, repo pattern, links — not full tutorials.

## Architecture & monorepo (repo-specific)

| Doc                                                        | Topic                       |
| ---------------------------------------------------------- | --------------------------- |
| [../01-architecture.md](../01-architecture.md)             | 5-layer stack               |
| [../02-project-structure.md](../02-project-structure.md)   | Folder layout               |
| [../03-code-organization.md](../03-code-organization.md)   | Imports, component taxonomy |
| [../04-feature-module.md](../04-feature-module.md)         | Feature template + services |
| [../11-services-migration.md](../11-services-migration.md) | Services layer              |

## Knowledge index

| Folder                                            | Topics                                          |
| ------------------------------------------------- | ----------------------------------------------- |
| [nextjs/](./nextjs/README.md)                     | App Router, Server Actions, caching, middleware |
| [react/](./react/README.md)                       | Hooks, Suspense, error boundaries               |
| [typescript/](./typescript/README.md)             | Types, generics, `as const`                     |
| [data-fetching/](./data-fetching/README.md)       | Fetch, TanStack Query, pagination               |
| [state-management/](./state-management/README.md) | Zustand, Query cache, Context                   |
| [forms/](./forms/README.md)                       | RHF, Zod                                        |
| [ui/](./ui/README.md)                             | Shadcn, Tailwind, a11y                          |
| [performance/](./performance/README.md)           | RSC, bundle, Vercel rules map                   |
| [security/](./security/README.md)                 | XSS, CSRF, env, auth                            |

## Cursor rules (coding)

- [../../rules/fe-coding-react.mdc](../../rules/fe-coding-react.mdc)
- [../../rules/fe-coding-typescript.mdc](../../rules/fe-coding-typescript.mdc)
- [../../rules/fe-coding-styling.mdc](../../rules/fe-coding-styling.mdc)
- [../../rules/fe-services-layer.mdc](../../rules/fe-services-layer.mdc)
- [../../rules/fe-performance.mdc](../../rules/fe-performance.mdc)
- [../../rules/fe-security.mdc](../../rules/fe-security.mdc)

## Deep playbooks (skills)

- [../../skills/form-patterns/SKILL.md](../../skills/form-patterns/SKILL.md)
- [../../skills/auth-patterns/SKILL.md](../../skills/auth-patterns/SKILL.md)
- [../../skills/vercel-react-best-practices/SKILL.md](../../skills/vercel-react-best-practices/SKILL.md)
- [../../skills/generators/](../../skills/generators/) — scaffold / codegen
