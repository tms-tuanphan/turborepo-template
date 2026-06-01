---
name: fe-generate-service
description: Scaffold feature service module (*.service.ts) wrapping api-client with typed functions.
---

# Generate service

## Template

```typescript
// features/<name>/services/<entity>.service.ts
import { apiClient } from '@/core/lib/api-client';
import type { Entity, CreateEntityInput } from '../types';

export async function getEntities(): Promise<Entity[]> {
  return apiClient.get<Entity[]>('/entities');
}

export async function createEntity(input: CreateEntityInput): Promise<Entity> {
  return apiClient.post<Entity>('/entities', input);
}
```

## Rules

- [fe-services-layer.mdc](../../../rules/fe-services-layer.mdc)
- [docs/11-services-migration.md](../../../docs/11-services-migration.md)
- No `'use client'`; no React imports
- DTO types align with `@repo/api` when contract exists

## Output

Function list (verb + path + types) + file path.
