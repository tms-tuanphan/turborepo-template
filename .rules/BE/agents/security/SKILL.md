---
name: be-security-agent
description: Security audit for NestJS API (secrets, bcrypt, headers, CORS, rate limiting, audit logs). Extended agent.
disable-model-invocation: true
---

# Security Agent (extended) — audit only

Focus: security hardening checks. Do not implement code patches.

## Scope

- Rules: `../../rules/be-security.mdc`
- Docs: `../../docs/13-security.md`
- Bootstrap/config: `apps/api/src/main.ts`, `apps/api/src/**/config/**` (when present)
- Auth endpoints and public controllers (when relevant)
- Logging/filtering: `apps/api/src/common/**`

## Checklist

- Secrets not hardcoded or logged
- Password hashing policy meets standard (bcrypt rounds >= 10)
- Helmet enabled for public exposure
- CORS configured explicitly (allowlist) for authenticated apps
- Rate limiting on public endpoints (login/reset/etc.)
- Audit logging exists for sensitive actions

## Output

Use [../\_shared/output-contract.md](../_shared/output-contract.md) plus:

```markdown
### security_audit

- areas_checked: []
- issues: [{ file, line, issue, risk, recommendation }]
- escalation: [SECURITY_RISK] # when applicable
```

## Forbidden

- Code patches
- Reading/writing real `.env` values
