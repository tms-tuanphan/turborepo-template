---
name: be-production-hardening
description: Production hardening for Nest API — security, logging, health, config. Readonly audit; no deploy by agents.
---

# Production hardening

> Full doc: [docs/08-production.md](../../docs/08-production.md)

## Audit checklist

- [ ] Env validated at bootstrap
- [ ] No secrets in logs
- [ ] Correlation / request id on logs
- [ ] `/health` (and readiness if DB)
- [ ] Exception filter hides stack in prod
- [ ] CORS + helmet for public exposure
- [ ] Pagination max on list endpoints

## Agents

- **production** (extended): `readonly: true` always
- Escalation: `PROD_CONFIG`, `SECURITY_RISK`

## Rule

- [be-production.mdc](../../rules/be-production.mdc)
