---
name: shared-fullstack-i18n
description: Add or change i18n keys shared between BE (I18nKey) and FE (messages EN/JA). Use for API errors and validation messages.
---

# Fullstack i18n

> Docs: [docs/03-i18n-fe-be.md](../../docs/03-i18n-fe-be.md)  
> Rules: [i18n-contract.mdc](../../rules/i18n-contract.mdc)

## Checklist

1. **Add key** to `packages/api/src/common/i18n/keys.ts` (`I18nKey`)
2. **Export** via `packages/api/src/entry.ts` if new top-level export needed
3. **messages/en.json** — add matching nested key path
4. **messages/ja.json** — add Japanese translation
5. **messages/vi.json** — add if project maintains VI catalog
6. **BE** — use `I18nKey.*` in exceptions / validation messages
7. **FE** — use same key in `t()` for UI; map API `code` on errors
8. **Verify** — trigger error path; confirm EN/JA render

## Naming

- Machine-friendly dots: `errors.domain.specific`
- Match structure between `I18nKey` string and JSON nesting

## Do not

- Hardcode Vietnamese/English in BE services for client-facing errors
- Add FE-only UI strings to `I18nKey` (keep UI copy in `messages/` only)
