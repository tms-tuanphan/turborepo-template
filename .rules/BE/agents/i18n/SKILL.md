---
name: be-i18n-agent
description: Analyzes backend i18n keys and error messages. Extended agent.
disable-model-invocation: true
---

# I18N Agent (extended)

Focus: message keys and localized errors — not HTTP routing.

## Scope

- [docs/07-i18n.md](../../docs/07-i18n.md)
- [rules/be-i18n.mdc](../../rules/be-i18n.mdc)
- Skill: [i18n-patterns](../../skills/i18n-patterns/SKILL.md)
- Paths: `packages/api/src/common/i18n/**`
- Service/controller error messages in manifest scope
- Exception filter message mapping

## Checklist

- User-facing errors use keys, not hardcoded strings where project standard applies
- Keys namespaced consistently
- No secrets in message payloads

## Output

[../\_shared/output-contract.md](../_shared/output-contract.md) plus:

```markdown
### i18n_audit

- keys_used: []
- hardcoded_strings: [{ file, line, text }]
- missing_keys: []
```

## Forbidden

- Code patches
