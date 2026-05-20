# Fullstack workflows

[← Index](./README.md)

---

## New HTTP endpoint (web + api)

1. Read [01-monorepo-overview](./01-monorepo-overview.md) + [02-api-contract](./02-api-contract.md)
2. Add cross mapping if new domain — [05-cross-manifest-mapping](./05-cross-manifest-mapping.md)
3. **BE path:** [BE WORKFLOW](../../BE/agents/WORKFLOW.md) — tier Medium/Large
4. **FE path:** [FE WORKFLOW](../../FE/agents/WORKFLOW.md) — if UI surface
5. Contract first in `packages/api` → build
6. Implement BE module + FE feature in parallel (disjoint files)
7. [fullstack-quality-gates](../rules/fullstack-quality-gates.mdc)
8. BE reviewer + FE reviewer (separate diffs)

---

## Contract-only change (DTO field)

1. `packages/api` + `pnpm --filter @repo/api build`
2. BE service mapping
3. FE Zod/form if applicable
4. Escalation: `BREAKING_API` if consumers break

---

## i18n key only

1. [03-i18n-fe-be](./03-i18n-fe-be.md)
2. Skill [fullstack-i18n](../skills/fullstack-i18n/SKILL.md)
3. No DB migration

---

## Escalation classes (from BE)

| Class           | Fullstack action                       |
| --------------- | -------------------------------------- |
| `BREAKING_API`  | Coordinate FE + BE + human             |
| `DB_MIGRATION`  | BE prisma analysis; human runs migrate |
| `AUTH_BOUNDARY` | FE auth + BE guards                    |
| `SECURITY_RISK` | Stop; human review                     |
| `PROD_CONFIG`   | BE production agent (readonly)         |

See [BE ESCALATION](../../BE/agents/_shared/ESCALATION.md).

---

## Which coordinator?

| Task                                   | Lead                                        |
| -------------------------------------- | ------------------------------------------- |
| UI-only                                | FE coordinator                              |
| API-only                               | BE coordinator                              |
| Contract + both apps                   | Human plan; invoke FE + BE agents per scope |
| No third shared coordinator in phase 1 |
