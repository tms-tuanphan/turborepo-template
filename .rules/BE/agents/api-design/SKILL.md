---
name: be-api-design-agent
description: Audits REST semantics, status codes, versioning, idempotency, and error payload consistency. Extended agent.
disable-model-invocation: true
---

# API Design Agent (extended) — audit only

Focus: HTTP semantics and contract-level behavior. Do not implement code patches.

## Scope

- Rules: `../../rules/be-api-design.mdc`
- Docs: `../../docs/10-api-design.md`
- Contract (when relevant): `packages/api/**`
- Controllers (when relevant): `apps/api/src/**/controllers/**`
- Error filter/payload shaping (when relevant): `apps/api/src/common/**`

## Checklist

- Correct HTTP verb usage (`GET/POST/PUT/PATCH/DELETE`)
- Proper status codes for business failures (4xx, not 200)
- Versioning strategy consistent (URL `/v1` or `Accept`, not query param)
- Idempotency-Key support for critical write endpoints (when applicable)
- Error payload is structured and includes `requestId`

## Output

Use [../\_shared/output-contract.md](../_shared/output-contract.md) plus:

```markdown
### api_design_audit

- endpoints_checked: []
- issues: [{ file, line, issue, recommendation }]
```

## Forbidden

- Code patches
- Refactoring controllers/services
