---
name: fe-generate-query-hooks
description: Scaffold TanStack Query hooks for a feature entity (queryKey conventions, mutations, invalidation).
---

# Generate query hooks

## Template

```typescript
// features/<name>/hooks/use-<entities>.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEntitiesAction, createEntityAction } from '../actions';
import type { CreateEntityInput } from '../types';

const keys = { all: ['entities'] as const };

export function useEntities() {
  return useQuery({ queryKey: keys.all, queryFn: getEntitiesAction });
}

export function useCreateEntity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEntityInput) => createEntityAction(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
```

## Rules

- Actions delegate to services — [fe-services-layer.mdc](../../../rules/fe-services-layer.mdc)
- Colocate `queryKey` factory in same file
- [docs/knowledge/data-fetching/react-query.md](../../../docs/knowledge/data-fetching/react-query.md)

## Output

Hook names + query keys + invalidation map.
