# Services layer migration

[← Về mục lục](./README.md)

Guide for moving HTTP logic from Server Actions / components into `services/`. Rules: [fe-services-layer.mdc](../rules/fe-services-layer.mdc).

---

## Target layout

```
features/users/
├── services/user.service.ts   # getUsers(), createUser(), …
├── actions/create-user.ts     # Zod → userService.create → revalidatePath
└── hooks/use-users.ts         # useQuery({ queryFn: () => getUsersAction() })
```

`core/lib/api-client.ts` stays the low-level fetch wrapper. **Only services** (feature or `core/services/`) call it.

---

## Migration steps (per feature)

1. Create `features/<name>/services/<entity>.service.ts`.
2. Move `apiClient.get/post/...` from actions into service functions.
3. Slim actions to: parse FormData/body with Zod → call service → revalidate/redirect.
4. Remove any `fetch` / `apiClient` from `components/*.tsx`.
5. Keep hooks calling actions or services (server-safe reads via actions that delegate to services).

---

## Before / after

### Before (action owns HTTP)

```typescript
// features/users/actions/get-users.ts
'use server';

import { apiClient } from '@/core/lib/api-client';

export async function getUsersAction() {
  return apiClient.get<User[]>('/users');
}
```

### After (service owns HTTP)

```typescript
// features/users/services/user.service.ts
import { apiClient } from '@/core/lib/api-client';
import type { User } from '../types';

export async function getUsers(): Promise<User[]> {
  return apiClient.get<User[]>('/users');
}
```

```typescript
// features/users/actions/get-users.ts
'use server';

import { getUsers } from '../services/user.service';

export async function getUsersAction() {
  return getUsers();
}
```

---

## Backward compatibility

- Public `index.ts` exports stay the same (actions, components).
- Migrate one action at a time; no big-bang required.
- New features **must** use `services/` from day one.

---

## Tiếp theo

→ [05-code-patterns.md](./05-code-patterns.md) — full examples including services + TanStack Query
