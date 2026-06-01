---
name: be-i18n-patterns
description: Backend i18n message keys and locale strategy. Use for error messages and validation copy on API.
---

# Backend i18n patterns

> Full doc: [docs/07-i18n.md](../../docs/07-i18n.md)

## Keys (packages/api)

```typescript
export const I18nKey = {
  Errors: {
    Links: { NotFound: 'errors.links.notFound' },
  },
} as const;
```

## Exceptions

```typescript
throw new NotFoundException(I18nKey.Errors.Links.NotFound);
```

## Locale

- Detect locale in middleware/guard, not ad-hoc in services/controllers:
  - `Accept-Language` (preferred) → `?lang=` → user preference
- Fallback `en`
- Missing key: fallback to `en` + log warning (no PII)

## Validation (class-validator)

- DTO messages must be **keys**, not literals.
- Prefer namespaced keys: `validation.user.email.isEmail`, `validation.auth.password.weak`.
- DTO validates shape only; business rules live in service and throw errors by key.

## Where to apply i18n

- Validation errors
- Business errors
- Email templates (confirm/reset)
- Push notifications (if used)

## Rule & agent

- [be-i18n.mdc](../../rules/be-i18n.mdc)
- Agent: [i18n](../../agents/i18n/SKILL.md) (extended)
