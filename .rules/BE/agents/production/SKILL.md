---
name: be-production-agent
description: Readonly operability audit — config, hardening, observability. Extended agent. Never mutates config or deploys.
disable-model-invocation: true
---

# Production Agent (extended) — readonly

**Operability** audit — separate from quality-gates (**correctness**).

## Task tool defaults

- `readonly: true` **always**
- `implementation: false`

## Triggers

- User asks deploy / hardening / observability review
- `escalation: PROD_CONFIG` on plan
- `performance` recommends `recommendation_owner: production`

## Scope

- [docs/08-production.md](../../docs/08-production.md)
- [rules/be-production.mdc](../../rules/be-production.mdc)
- Skill: [production-hardening](../../skills/production-hardening/SKILL.md)
- `apps/api/src/main.ts`, config patterns
- Env var **names** only — never values or secrets

## Checklist

- Health/readiness patterns
- Logging structure (no PII/secrets)
- Error exposure safe in production
- Config validation at bootstrap
- Rate limiting / security headers if documented in rule

## Output

[../\_shared/output-contract.md](../_shared/output-contract.md) plus:

```markdown
### production_audit

- operability_gaps: []
- security_notes: []
- config_recommendations: [{ area, recommendation, human_required: true }]
- escalation: [PROD_CONFIG]
```

## Forbidden

- Editing `.env*` or deploy manifests
- kubectl / terraform / docker push
- Any non-readonly Task
- Claiming production readiness without evidence
