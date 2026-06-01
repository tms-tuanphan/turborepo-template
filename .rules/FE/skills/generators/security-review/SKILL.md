---
name: fe-security-review
description: Security review for FE scope — env, Server Actions auth, XSS, secrets in client. Use on auth/API/forms changes.
---

# Security review

## Delegate

- [fe-security.mdc](../../../rules/fe-security.mdc)
- [docs/knowledge/security/README.md](../../../docs/knowledge/security/README.md)
- [auth-patterns/SKILL.md](../../auth-patterns/SKILL.md)
- [server-auth-actions](../../vercel-react-best-practices/rules/server-auth-actions.md)

## Checklist

- [ ] No secrets / private env in `'use client'` files
- [ ] `NEXT_PUBLIC_*` only for safe values
- [ ] Server Actions: authZ before service call
- [ ] Zod on all external input (forms, JSON bodies)
- [ ] Safe error messages (no stack traces to UI)
- [ ] No raw `dangerouslySetInnerHTML` without sanitization
- [ ] Session/cookie flags per auth skill

## Output

```markdown
### security_review

- findings: [{ file, line, severity, description }]
- status: pass | fail
```

## Next

- [api agent](../../../agents/api/SKILL.md) for mutation details
- [reviewer agent](../../../agents/reviewer/SKILL.md) last
