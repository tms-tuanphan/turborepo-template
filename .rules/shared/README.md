# Shared rules (FE ↔ BE)

Fullstack layer for this Turborepo — **outside** [FE](../FE/) and [BE](../BE/).

| Layer        | Path                                               | Role                                 |
| ------------ | -------------------------------------------------- | ------------------------------------ |
| **Index**    | [shared-rules-index.mdc](./shared-rules-index.mdc) | `alwaysApply: true` — contract entry |
| **Rules**    | [rules/](./rules/)                                 | Short glob rules                     |
| **Docs**     | [docs/](./docs/)                                   | Detailed guides                      |
| **Skills**   | [skills/](./skills/)                               | Playbooks                            |
| **Mappings** | [mappings/](./mappings/)                           | FE feature ↔ BE module registry     |

```bash
pnpm shared:mapping-check
```
