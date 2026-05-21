# BE task workflow

For **you** and the **Coordinator** on backend tasks in this monorepo. Orchestration detail: [coordinator/AGENTS.md](./coordinator/AGENTS.md).

---

## When to use this flow

| Situation                       | Approach                                        |
| ------------------------------- | ----------------------------------------------- |
| 1–2 files, clear scope          | `.mdc` rules directly — no multi-agent pipeline |
| One Nest module, known manifest | **Small / Medium**                              |
| New module, DB, cross-package   | **Large** + plan + escalation                   |
| PR review only                  | quality-gates (optional) → **reviewer**         |

---

## Step 0 — Prompt for Coordinator (Agent mode)

```text
Task BE: <short description>
Module manifest: <links | app | none>
Complexity: <small | medium | large> — ~<N> files
Expected: <API behavior>
Known risks (optional): <DB migration, breaking DTO, auth, ...>
Escalation (optional): <DB_MIGRATION | BREAKING_API | ...>

Follow .rules/BE/agents/WORKFLOW.md and coordinator/AGENTS.md.
Core-first discovery. After implement: quality-gates → reviewer last.
```

---

## Complexity tiers (required)

| Tier       | Estimate                       | Discovery max                 | Core                                     | Extended cap |
| ---------- | ------------------------------ | ----------------------------- | ---------------------------------------- | ------------ |
| **Small**  | &lt; 5 files, 1 concern        | **1** — usually `module` only | module                                   | **0**        |
| **Medium** | 5–10 files, 1 module           | **3**                         | module + 1–2 of service \| dto \| prisma | **≤1**       |
| **Large**  | &gt; 10 files or new module/DB | **6**                         | full core path                           | **≤3**       |

Do **not** spawn `repo-scanner` on Medium when manifest is known.

---

## Orchestration budgets

```yaml
max_depth: 2
max_parallel: 4
max_extended_per_task: 3
core_first: true
```

- **depth=1:** first discovery wave
- **depth=2:** one follow-up from `next_agents`
- **depth>2:** Coordinator implements or asks user — no more Task spawns

---

## 4 phases

```text
Phase 1 — Discovery (readonly Task, scoped, core-first)
Phase 2 — Implement (Coordinator, within manifest.scope)
Phase 3 — quality-gates → reviewer (reviewer ALWAYS last)
Phase 4 — Escalation checkpoint (human) when tagged
```

### Phase 1 — Discovery

1. Read manifest: `.rules/BE/agents/module/manifests/<id>.json`
2. Spawn Task per [recipes](./coordinator/AGENTS.md) — respect tier + budgets
3. Write **Shared findings cache** (once — template in coordinator)
4. Sub-agent output is **advisory**; Coordinator owns decisions

### Phase 2 — Implement

- Edit only within `manifest.scope` (+ `allowedImports`)
- Do not grep all of `apps/api` when manifest exists
- Layer table: controller → service → domain → prisma (see service/domain SKILL)
- Tag escalation in plan when applicable ([ESCALATION.md](./_shared/ESCALATION.md))

### Phase 3 — Close

1. **quality-gates** — see [COMMAND_POLICY.md](./_shared/COMMAND_POLICY.md):
   - `pnpm --filter api lint`
   - `pnpm --filter api test`
   - `pnpm --filter api build` when module wiring / bootstrap changed
   - `pnpm --filter api test:e2e` when HTTP contract changed (optional)
2. **reviewer** — git diff only; severity on every issue
3. Do not mark done on `BLOCK` or unaddressed `major` / `blocking`

### Phase 4 — Human escalation

Required when plan lists `DB_MIGRATION`, `SECURITY_RISK`, `BREAKING_API`, or `PROD_CONFIG`. Agents do not run migrate or deploy.

---

## Tier matrices

### Small

```text
module → implement → quality-gates → reviewer
```

### Medium (example: new field on Links)

```text
module → dto → service → implement → quality-gates → reviewer
```

Optional parallel (disjoint files): `dto` + `controller` if both in scope.

### Medium — Admin blogs list (phase 1)

```text
module → prisma → dto → service → controller
→ quality-gates → reviewer
```

- Manifest: `blogs.json`
- Skill: `.rules/shared/skills/admin-blogs-phase1-list/SKILL.md`
- Design: `.rules/BE/docs/API_ADMIN_BLOGS_DESIGN.md`
- Escalation: `DB_MIGRATION`
- Scope: `GET /api/admin/blogs` only — no CRUD, upload, public API, blog-ai

### Large (new endpoint + DB)

```text
repo-scanner (if needed) → module → prisma → dto → service → controller
→ test (plan) → implement → quality-gates → reviewer
```

---

## Layer ownership (summary)

| Layer      | Owns                                     |
| ---------- | ---------------------------------------- |
| controller | HTTP transport, DTO binding              |
| service    | Use-case orchestration                   |
| domain     | Business invariants, transactions policy |
| prisma     | Persistence                              |
| dto        | Contract shape                           |

Conflict service vs domain: invariant → **domain**; wiring → **service**.

---

## Ownership

| Role            | Authority                                 |
| --------------- | ----------------------------------------- |
| **Sub-agents**  | Scoped analysis, evidence, suggestions    |
| **Coordinator** | Merge, conflicts, implementation, budgets |
| **Reviewer**    | Verdict on diff vs rules                  |

---

## Checklist (per task)

```text
[ ] Tier: small | medium | large
[ ] Manifest + escalation list
[ ] Plan OK (large or ≥3 agents)
[ ] Phase 1: discovery within tier + budgets
[ ] Shared findings cache written
[ ] Phase 2: implement in scope
[ ] Phase 3: quality-gates → reviewer
[ ] Human checkpoint if escalation tagged
[ ] Verdict APPROVE or fixed and re-reviewed
```

---

## Links

- [coordinator/AGENTS.md](./coordinator/AGENTS.md)
- [README.md](./README.md)
- [\_shared/output-contract.md](./_shared/output-contract.md)
- [\_shared/COMMAND_POLICY.md](./_shared/COMMAND_POLICY.md)
- [\_shared/ESCALATION.md](./_shared/ESCALATION.md)
