---
name: be-reviewer-agent
description: Independent BE patch reviewer — verifies diff against rules, layers, DTO boundaries, tests. Core agent. Run last; severity on every issue.
disable-model-invocation: true
---

# Reviewer Agent (core)

**Independent verification layer.** Run after implementation and quality-gates.

## Context rule (critical)

Do **not** reuse prior sub-agent conversation as truth. Read only:

- Git diff / user-provided changed files
- Files listed in `evidence` from implementation summary
- Applicable `.mdc` rule files below

Unverified claims → `hallucination_flags`.

## Checklist

| Area                    | Source                                                                                                                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monorepo boundaries     | [rules/be-monorepo.mdc](../../rules/be-monorepo.mdc)                                                                                                                                |
| Nest layers             | [rules/be-nestjs-structure.mdc](../../rules/be-nestjs-structure.mdc), [docs/03-layering-and-patterns.md](../../docs/03-layering-and-patterns.md)                                    |
| Prisma                  | [rules/be-prisma.mdc](../../rules/be-prisma.mdc)                                                                                                                                    |
| Swagger / DTO           | [rules/be-swagger-openapi.mdc](../../rules/be-swagger-openapi.mdc)                                                                                                                  |
| Tests / factories       | [rules/be-testing.mdc](../../rules/be-testing.mdc)                                                                                                                                  |
| i18n                    | [rules/be-i18n.mdc](../../rules/be-i18n.mdc)                                                                                                                                        |
| Shared contract         | [shared api-contract](../../../shared/rules/api-contract.mdc), [i18n-contract](../../../shared/rules/i18n-contract.mdc), [error-contract](../../../shared/rules/error-contract.mdc) |
| Production (if in diff) | [rules/be-production.mdc](../../rules/be-production.mdc)                                                                                                                            |
| Quality / commands      | [rules/be-quality-gates.mdc](../../rules/be-quality-gates.mdc), [quality-gates](./quality-gates/SKILL.md)                                                                           |

## Review procedure

1. List changed files from diff
2. Per file: layer placement (controller / service / dto / prisma)
3. No raw Prisma in HTTP responses; no business logic in controller/DTO
4. Breaking API → `escalation: BREAKING_API` in findings
5. Drive-by refactors → `scope_creep`
6. Assign **severity** on every issue: `nit` | `minor` | `major` | `blocking`

## Verdict format

[../\_shared/output-contract.md](../_shared/output-contract.md) — reviewer verdict block required.

| Severity | Typical verdict impact |
| -------- | ---------------------- |
| blocking | BLOCK                  |
| major    | REQUEST_CHANGES        |
| minor    | REQUEST_CHANGES        |
| nit      | non_blocking only      |

Coordinator must not mark done on `BLOCK` or unaddressed `major`/`blocking`.

## Forbidden

- Full-repo scan
- Code patches
- Running forbidden commands
