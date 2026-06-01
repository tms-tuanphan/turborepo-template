---
name: fe-generate-form
description: Scaffold React Hook Form + Zod + Server Action form flow in a feature. Delegates to form-patterns skill.
---

# Generate form

## Delegate (read, do not duplicate)

- [form-patterns/SKILL.md](../../form-patterns/SKILL.md)
- [form-patterns/basic.md](../../form-patterns/basic.md)
- [form-patterns/server-action.md](../../form-patterns/server-action.md)
- [fe-server-actions.mdc](../../../rules/fe-server-actions.mdc)

## Files to generate

```
features/<name>/
├── validations/<entity>.schema.ts
├── components/<entity>-form.tsx    # 'use client', RHF + Shadcn Form
├── actions/<action>.ts             # Zod → service → revalidate
└── services/<entity>.service.ts    # HTTP
```

## Rules

- Zod is single source of truth; `z.infer` for form types
- i18n labels via message keys — [fe-i18n.mdc](../../../rules/fe-i18n.mdc)
- No validation `if/else` in JSX

## Output

Stub filenames + field list from schema; link to form-patterns examples.
