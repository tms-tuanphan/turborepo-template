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

- Read `Accept-Language` in middleware or guard
- Fallback `en`

## Rule & agent

- [be-i18n.mdc](../../rules/be-i18n.mdc)
- Agent: [i18n](../../agents/i18n/SKILL.md) (extended)
