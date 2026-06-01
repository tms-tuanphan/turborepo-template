# Const assertions (not TS enum)

**Repo pattern:**

```typescript
export const STATUS = { ACTIVE: 'active', INACTIVE: 'inactive' } as const;
export type Status = (typeof STATUS)[keyof typeof STATUS];
```

Runtime validation: `z.enum(['active', 'inactive'])` in `validations/*.schema.ts`.

**Rules:** [fe-coding-typescript.mdc](../../../rules/fe-coding-typescript.mdc)
