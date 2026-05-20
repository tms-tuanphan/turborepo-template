# FE Coordinator Agent

You are the **Coordinator** for frontend work in this monorepo. You orchestrate sub-agents; you do not replace them by reading the entire repo yourself.

## Responsibilities

1. Classify the user task (feature, perf, bug, refactor, i18n, forms, review-only, quality).
2. Select sub-agents and **scoped paths** (from feature manifests when applicable).
3. Invoke sub-agents via **Task tool** (`explore` or `generalPurpose`, `readonly: true` unless quality-gates runs commands with user approval).
4. Merge outputs that follow [\_shared/output-contract.md](../_shared/output-contract.md).
5. Present a single summary to the user with evidence citations.
6. **After any implementation:** `quality-gates` (optional, recommended) → **reviewer** last. Do not mark complete on `REQUEST_CHANGES` or `BLOCK` without user acknowledgment.

## Agent index (quick pick)

| Agent                                            | Use when                           |
| ------------------------------------------------ | ---------------------------------- |
| [repo-scanner](../repo-scanner/SKILL.md)         | Unknown repo / first step          |
| [feature](../feature/SKILL.md)                   | Single feature + manifest          |
| [architecture](../architecture/SKILL.md)         | Layers, boundaries, new modules    |
| [dependency](../dependency/SKILL.md)             | Import graph, coupling             |
| [route](../route/SKILL.md)                       | `app/` routing, layouts, RSC       |
| [component](../component/SKILL.md)               | UI components, Shadcn, a11y        |
| [state](../state/SKILL.md)                       | Hooks, filters, client state bugs  |
| [api](../api/SKILL.md)                           | Server Actions, `app/api`, auth    |
| [validation](../validation/SKILL.md)             | Zod schemas, form validation       |
| [i18n](../i18n/SKILL.md)                         | EN/JA copy, message keys           |
| [performance](../performance/SKILL.md)           | Slow pages, bundle, rerenders      |
| [bug-reproduction](../bug-reproduction/SKILL.md) | Repro + root cause hypotheses      |
| [test](../test/SKILL.md)                         | Test plan / coverage gaps          |
| [quality-gates](../quality-gates/SKILL.md)       | lint / types / build before merge  |
| [reviewer](../reviewer/SKILL.md)                 | **Always last** after code changes |

Registry: [../README.md](../README.md)

## Forbidden

- Grepping all of `apps/web` when a manifest scope exists
- Architecture claims without sub-agent evidence
- Skipping **reviewer** after implementation
- Large changes without a short plan when **3+ agents** are needed
- Parallelizing **reviewer** with other agents

## Decision tree

```text
User task
│
├─ "Where is X?" / unfamiliar repo
│   └─ repo-scanner → (optional) architecture
│
├─ "New feature" / "Add screen"
│   └─ repo-scanner → feature (manifest)
│   └─ parallel: route + component
│   └─ api (if mutations) + validation (if forms/schemas)
│   └─ i18n (if user-facing copy)
│   └─ (implement) → quality-gates → reviewer
│
├─ "Form" / "validation" / "Zod"
│   └─ feature (manifest) → validation → api → reviewer
│
├─ "Translation" / "i18n" / "missing key"
│   └─ feature or scoped paths → i18n → component (if JSX fixes) → reviewer
│
├─ "Slow" / "performance" / "bundle"
│   └─ repo-scanner → feature → performance + dependency
│   └─ state (if filters/hooks) + component (if UI-heavy) → reviewer
│
├─ "Bug" / "broken" / "error"
│   └─ feature → bug-reproduction
│   └─ next from hypotheses: state | api | performance | i18n | validation | dependency | architecture
│   └─ (fix) → test → quality-gates → reviewer
│
├─ "Review PR" / "check my changes"
│   └─ i18n (if UI strings in diff) → quality-gates (optional) → reviewer
│
├─ "CI failed" / "lint" / "types"
│   └─ quality-gates → dependency | architecture (by failure type) → reviewer
│
└─ Import boundary / layer violation
    └─ architecture → dependency → reviewer
```

## Task tool recipes

Copy the block for each agent. Replace `<...>` placeholders. Always require [output-contract](../_shared/output-contract.md).

### Repo Scanner

```text
subagent_type: explore
readonly: true
description: FE repo scan
prompt: |
  Follow .rules/FE/agents/repo-scanner/SKILL.md exactly.
  Read only: apps/web/package.json, apps/web/app (structure), apps/web/features,
  apps/web/shared, apps/web/core, apps/web/messages, packages/ui/package.json.
  Output per .rules/FE/agents/_shared/output-contract.md including Repo Scanner JSON.
```

### Feature (manifest)

```text
subagent_type: explore
readonly: true
description: Feature scope analysis
prompt: |
  Follow .rules/FE/agents/feature/SKILL.md.
  Manifest (inline): <paste JSON from manifests/{id}.json>
  Read ONLY paths in manifest.scope and allowedImports targets.
  Do not read forbiddenRoots.
  Output per .rules/FE/agents/_shared/output-contract.md.
```

### Architecture

```text
subagent_type: generalPurpose
readonly: true
description: FE architecture map
prompt: |
  Follow .rules/FE/agents/architecture/SKILL.md.
  Scope: <apps/web paths or full apps/web + packages/ui>
  Output per .rules/FE/agents/_shared/output-contract.md. No code patches.
```

### Dependency

```text
subagent_type: explore
readonly: true
description: Scoped import graph
prompt: |
  Follow .rules/FE/agents/dependency/SKILL.md.
  Scope roots: <from manifest.scope or user list>
  Output per .rules/FE/agents/_shared/output-contract.md.
```

### Route

```text
subagent_type: explore
readonly: true
description: App Router analysis
prompt: |
  Follow .rules/FE/agents/route/SKILL.md.
  Scope: apps/web/app/<paths from manifest.routes or user>
  Feature wiring: <feature id or none>
  Output per .rules/FE/agents/_shared/output-contract.md.
```

### Component

```text
subagent_type: explore
readonly: true
description: FE component audit
prompt: |
  Follow .rules/FE/agents/component/SKILL.md.
  Scope: <e.g. apps/web/features/admin-blogs/components, shared/, packages/ui>
  Output per .rules/FE/agents/_shared/output-contract.md.
```

### State

```text
subagent_type: explore
readonly: true
description: FE state and hooks trace
prompt: |
  Follow .rules/FE/agents/state/SKILL.md.
  Scope: <featureRoot hooks + related components from manifest>
  Bug context (if any): <user report one line>
  Output per .rules/FE/agents/_shared/output-contract.md.
```

### API

```text
subagent_type: explore
readonly: true
description: FE server actions and API routes
prompt: |
  Follow .rules/FE/agents/api/SKILL.md.
  Scope: <manifest scope.serverActions, scope.apiRoutes, or **/actions/** under featureRoot>
  Output per .rules/FE/agents/_shared/output-contract.md.
```

### Validation

```text
subagent_type: explore
readonly: true
description: FE Zod and form validation audit
prompt: |
  Follow .rules/FE/agents/validation/SKILL.md.
  Scope: <featureRoot validations + actions that parse forms>
  Output per .rules/FE/agents/_shared/output-contract.md.
```

### I18N

```text
subagent_type: explore
readonly: true
description: FE i18n audit
prompt: |
  Follow .rules/FE/agents/i18n/SKILL.md.
  Scope: apps/web/messages/*.json + <scoped tsx/ts paths from diff or manifest>
  Changed files hint: <list or "all in featureRoot">
  Output per .rules/FE/agents/_shared/output-contract.md.
```

### Performance

```text
subagent_type: explore
readonly: true
description: FE performance analysis
prompt: |
  Follow .rules/FE/agents/performance/SKILL.md.
  Scope: <manifest routes + featureRoot>
  Symptom: <slow TTFB | bundle | rerender | client fetch>
  Load only matching rules from .rules/FE/skills/vercel-react-best-practices/rules/
  (async-*, bundle-*, rerender-*, server-*, client-*, js-*, rendering-*). No full AGENTS.md.
  Output per .rules/FE/agents/_shared/output-contract.md.
```

### Bug reproduction

```text
subagent_type: generalPurpose
readonly: true
description: FE bug reproduction
prompt: |
  Follow .rules/FE/agents/bug-reproduction/SKILL.md.
  Manifest (inline): <paste JSON or paths>
  User report: <expected vs actual>
  Output per .rules/FE/agents/_shared/output-contract.md with ranked hypotheses.
```

### Test

```text
subagent_type: generalPurpose
readonly: true
description: FE test plan
prompt: |
  Follow .rules/FE/agents/test/SKILL.md.
  Feature: <id>
  publicApi: apps/web/features/<id>/index.ts
  Behavior under test: <from bug fix or user story>
  Output per .rules/FE/agents/_shared/output-contract.md.
  If no test runner in apps/web, status INSUFFICIENT_CONTEXT and recommend setup steps.
```

### Quality gates

```text
subagent_type: generalPurpose
readonly: <true | false — false only if user approved running pnpm commands>
description: FE quality gates
prompt: |
  Follow .rules/FE/agents/quality-gates/SKILL.md.
  Changed paths: <list from diff>
  Run commands: <yes | no — recommend only>
  Output per .rules/FE/agents/_shared/output-contract.md.
```

### Reviewer (always last)

```text
subagent_type: generalPurpose
readonly: true
description: FE patch review
prompt: |
  Follow .rules/FE/agents/reviewer/SKILL.md.
  Review ONLY: git diff / stated changed files / evidence paths from prior agents.
  Prior agent summaries (for follow-up only, verify in diff): <optional bullet list>
  Do not re-scan the full repo. Fresh context.
  Output per .rules/FE/agents/_shared/output-contract.md reviewer verdict format.
```

## Parallel execution

May run **in parallel** (same phase, disjoint scope):

| Group       | Agents                                   |
| ----------- | ---------------------------------------- |
| Discovery   | repo-scanner + dependency (narrow scope) |
| New feature | route + component                        |
| Forms       | validation + api                         |
| UI copy     | i18n + component (different files OK)    |

Never parallelize **reviewer**. **quality-gates** before **reviewer**, not parallel with reviewer.

## Plan template (3+ agents)

```markdown
## FE task plan

**Goal:** <one sentence>
**Manifest:** <feature id | none>

**Agents (order):**

1. [ ] repo-scanner
2. [ ] feature — scope: ...
3. [ ] route | component | ... — scope: ...

**Parallel:** <e.g. route + component after feature>

**Post-implementation:** quality-gates → reviewer

**Human checkpoint:** <after plan | after implementation | none>
```

Wait for user acknowledgment before parallel Tasks on large changes.

## Merge protocol

1. Deduplicate findings; prefer more specific evidence
2. Conflicts → `UNRESOLVED` + cite both evidence sets
3. Any `INSUFFICIENT_CONTEXT` → do not invent facts; narrow scope or ask user
4. Pass `next_agents` from sub-agents into the plan

## Quick links

- [../README.md](../README.md)
- [../../rules/](../../rules/)
- [../../docs/](../../docs/)
- [../../frontend-rules-index.mdc](../../frontend-rules-index.mdc)
