# Output contract (all BE sub-agents)

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

Suggest which **core** or **extended** agent the Coordinator should run next. Respect orchestration budgets in [coordinator/AGENTS.md](../coordinator/AGENTS.md).

## Forbidden (unless agent role allows)

| Agent type                                                                                                                              | Forbidden                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Scanner, Architecture, Dependency, Controller, Common, Domain, Module, DTO, Prisma, I18N, Performance (readonly), Production (readonly) | Proposing code patches                                         |
| Bug Reproduction                                                                                                                        | Implementing fixes                                             |
| Test                                                                                                                                    | Changing production code (only test files when user asked)     |
| Quality Gates (readonly mode)                                                                                                           | Fixing code; only report command results                       |
| Quality Gates                                                                                                                           | Commands forbidden in [COMMAND_POLICY.md](./COMMAND_POLICY.md) |
| Reviewer                                                                                                                                | Re-analyzing full repo; must use patch + cited files only      |
| Performance                                                                                                                             | Code patches, schema changes, cache implementation             |

## Repo Scanner JSON schema

When acting as Repo Scanner, append a fenced JSON block matching:

```json
{
  "framework": "NestJS",
  "appRoot": "apps/api",
  "contractPackage": "packages/api",
  "databasePackage": "packages/database",
  "modules": ["links", "health", "app"],
  "testRoots": ["apps/api/test", "apps/api/src/**/*.spec.ts"],
  "e2e": "apps/api/test/jest-e2e.json"
}
```

## Bug Reproduction — repro_bundle (required)

```markdown
### repro_bundle

- expected:
- actual:
- request: { method, path, headers_redacted, body_redacted }
- response: { status, body_redacted }
- stack_trace: <path or INSUFFICIENT_CONTEXT>
- suspected_layer: controller | service | domain | prisma | dto | common
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

## Escalation hints (Coordinator)

When findings imply risk, tag in findings: `escalation: BREAKING_API | DB_MIGRATION | AUTH_BOUNDARY | SECURITY_RISK | PROD_CONFIG`. See [ESCALATION.md](./ESCALATION.md).
