# i18n across FE and BE

[← Index](./README.md)

---

## Two layers

| Layer    | Location                                          | Content                                    |
| -------- | ------------------------------------------------- | ------------------------------------------ |
| **Keys** | `packages/api/src/common/i18n/keys.ts`            | `I18nKey.Errors.*`, `I18nKey.Validation.*` |
| **Copy** | `apps/web/messages/en.json`, `ja.json`, `vi.json` | Human-readable strings                     |

BE returns **keys** in errors (`ApiErrorPayload.code`). FE resolves keys to localized copy.

---

## Example

**keys.ts:**

```typescript
I18nKey.Errors.Links.NotFound; // 'errors.links.notFound'
```

**messages/en.json** (nested or flat per team convention):

```json
{
  "errors": {
    "links": {
      "notFound": "Link not found"
    }
  }
}
```

**messages/ja.json:** corresponding Japanese string.

**BE:**

```typescript
throw new NotFoundException(I18nKey.Errors.Links.NotFound);
```

**FE:** `t('errors.links.notFound')` or map API `code` directly if namespaces match.

---

## Checklist for new key

- [ ] Added to `I18nKey` in `@repo/api`
- [ ] Added EN + JA in `apps/web/messages/`
- [ ] BE uses key (not literal string)
- [ ] FE displays translated text for API errors

Skill: [fullstack-i18n](../skills/fullstack-i18n/SKILL.md)  
Rule: [i18n-contract.mdc](../rules/i18n-contract.mdc)
