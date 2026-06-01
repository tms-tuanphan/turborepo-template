---
name: fe-generate-zustand-store
description: Scaffold a Zustand store for feature or shared client UI state.
---

# Generate Zustand store

## Template

```typescript
// features/<name>/stores/<name>-store.ts
import { create } from 'zustand';

type State = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

export const useExampleStore = create<State>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
}));
```

## Placement

- Feature-specific → `features/<name>/stores/`
- Cross-feature chrome → `shared/stores/`

## Rules

- Do not store server-fetched lists — use TanStack Query
- Keep private unless exported from feature `index.ts` intentionally
- [fe-coding-typescript.mdc](../../../rules/fe-coding-typescript.mdc) — typed state, no `any`

## Output

State shape + actions + file path.
