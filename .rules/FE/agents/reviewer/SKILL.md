---
name: fe-reviewer-agent
description: Independent FE patch reviewer — verifies changes against rules, i18n, import boundaries, a11y. Run last after implementation; uses only diff and cited files.
disable-model-invocation: true
---

# Reviewer Agent

**Independent verification layer.** Run after implementation agents complete.

## Context rule (critical)

Do **not** reuse prior sub-agent conversation as truth. Read only:

- Git diff / user-provided changed files
- Files listed in `evidence` from implementation summary
- Applicable rule files cited below

If a claim cannot be verified in those files → flag `hallucination_risk`.

## Checklist

| Area                 | Source                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Import boundaries    | [fe-import-boundaries.mdc](../../rules/fe-import-boundaries.mdc)                                                                     |
| i18n                 | [fe-i18n.mdc](../../rules/fe-i18n.mdc) — or prior [i18n agent](../i18n/SKILL.md) audit                                               |
| Validation / Zod     | [validation agent](../validation/SKILL.md) findings if forms in diff                                                                 |
| App Router / actions | [fe-next-app-router.mdc](../../rules/fe-next-app-router.mdc)                                                                         |
| UI / a11y            | [web-design-guidelines](../../skills/web-design-guidelines/SKILL.md)                                                                 |
| Types / quality      | [fe-quality-gates.mdc](../../rules/fe-quality-gates.mdc) — prefer [quality-gates agent](../quality-gates/SKILL.md) run before review |
| No `any`             | strict TS                                                                                                                            |

## Review procedure

1. List changed files from diff
2. Per file: verify layer placement and imports
3. Check new user strings use message keys (EN + JA) — keys namespaced per [i18n agent](../i18n/SKILL.md)
4. Check Server Actions have Zod + auth where needed
5. Detect drive-by refactors unrelated to task → `scope_creep`
6. Detect unsafe patterns: secrets in client, cross-feature imports
7. If UI in diff — UX/a11y spot-check (see below)
8. Use task **Risk** from plan when provided; flag regressions against listed risks

### UX / a11y spot-check (when diff touches UI)

- Loading, empty, error, disabled states for lists/forms/filters
- Keyboard reachable controls; visible focus
- Labels / `aria-invalid` / error text linked to fields
- No new hardcoded user-visible strings (EN + JA via keys)
- Delegate detailed a11y rules to [web-design-guidelines](../../skills/web-design-guidelines/SKILL.md) for cited files only

### Severity (every issue)

| Severity   | Meaning                                      | Affects verdict     |
| ---------- | -------------------------------------------- | ------------------- |
| `nit`      | Style, naming preference, optional polish    | `non_blocking` only |
| `minor`    | Should fix; low user impact                  | `REQUEST_CHANGES`   |
| `major`    | Correctness, a11y, i18n gap, maintainability | `REQUEST_CHANGES`   |
| `blocking` | Security, boundary break, broken build/types | `BLOCK` or blocking |

`verdict` rules:

- `APPROVE` — no `blocking` or `major` issues
- `REQUEST_CHANGES` — any `major` or `minor` worth fixing before merge
- `BLOCK` — any `blocking` issue, or multiple `major` without mitigation

## Output

[output-contract](../_shared/output-contract.md) plus reviewer verdict:

```text
verdict: APPROVE | REQUEST_CHANGES | BLOCK
issues: [{ file, line, issue, severity: nit|minor|major|blocking }]
blocking_issues: []  # subset severity=blocking (legacy compat)
non_blocking: []     # subset severity=nit
hallucination_flags: [{ claim, reason }]
scope_creep: []
```

## Forbidden

- Full-repo scan
- Approving without reading cited files
- Suggesting large rewrites when `REQUEST_CHANGES` with minimal fix is enough
