# Output contract (all FE sub-agents)

Every sub-agent response MUST follow this structure. The Coordinator merges outputs; inconsistent formats break orchestration.

## Required sections

### status

One of:

- `OK` — completed with enough context
- `INSUFFICIENT_CONTEXT` — could not verify; do not guess
- `BLOCKED` — external blocker (missing env, auth, tool failure)

### evidence

Required when status is `OK` and the agent makes any factual claim about code or structure.

Format (one per line):

```text
path/to/file.ts:L42 — short note or symbol name
```

Rules:

- Cite only files actually read in this run
- Include line numbers when referencing behavior
- No architecture claims without at least one evidence line

### findings

Bullet list of conclusions. Each bullet must be supportable by `evidence` or marked as `hypothesis` (only Bug Reproduction agent may use ranked hypotheses).

### scope_read

List of directories/files this agent was allowed to read (proves context partitioning).

### next_agents (optional)

Suggest which agent the Coordinator should run next, e.g. `performance`, `reviewer`.

## Forbidden (unless agent role allows)

| Agent type                                                                                                                             | Forbidden                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Scanner, Architecture, Dependency, Route, Component, State, API, Validation, I18N, Performance, Feature, Quality Gates (readonly mode) | Proposing code patches                                    |
| Bug Reproduction                                                                                                                       | Implementing fixes                                        |
| Test                                                                                                                                   | Changing production code (only test files)                |
| Quality Gates (when run allowed)                                                                                                       | Fixing code; only report command results                  |
| Reviewer                                                                                                                               | Re-analyzing full repo; must use patch + cited files only |

## Repo Scanner JSON schema

When acting as Repo Scanner, append a fenced JSON block matching:

```json
{
  "framework": "Next.js",
  "appRoot": "apps/web",
  "features": ["blogs", "admin-blogs", "admin-auth", "admin-shell"],
  "ui": "@repo/ui + apps/web/components/ui",
  "auth": "next-auth",
  "i18n": "apps/web/messages/*.json",
  "stateManagement": "string describing detected patterns",
  "routes": {
    "site": "apps/web/app/[locale]/(site)/**",
    "admin": "apps/web/app/[locale]/(admin)/**",
    "api": "apps/web/app/api/**"
  }
}
```

## Bug Reproduction hypothesis format

```text
Root cause probability:
- 70% — description (evidence: path:Lx)
- 20% — description
- 10% — description
```

## Reviewer verdict format

```text
verdict: APPROVE | REQUEST_CHANGES | BLOCK
issues: [{ file, line, issue, severity: nit|minor|major|blocking }]
blocking_issues: []   # severity=blocking only (optional duplicate)
non_blocking: []       # severity=nit only (optional duplicate)
hallucination_flags: []
scope_creep: []
```

Severity guide: `blocking` → BLOCK; `major` → REQUEST_CHANGES; `minor` → REQUEST_CHANGES; `nit` → non_blocking only.
