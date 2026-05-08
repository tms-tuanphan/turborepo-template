# 🧩 Cấu trúc Feature Module

[← Về mục lục](./README.md) | [← Code Organization](./03-code-organization.md)

---

## Template chuẩn

```
features/[feature-name]/
├── index.ts                  # ⭐ Public API
├── components/               # UI components
│   ├── [name].tsx
│   └── index.ts
├── actions/                  # Server Actions
│   ├── [name].ts
│   └── index.ts
├── hooks/                    # React hooks
│   ├── use-[name].ts
│   └── index.ts
├── stores/                   # State (optional)
│   └── [name]-store.ts
├── types/                    # TypeScript types
│   └── index.ts
├── validations/              # Zod schemas
│   └── [name].schema.ts
└── utils/                    # Helpers (optional)
    └── index.ts
```

---

## Public API Pattern

```typescript
// features/users/index.ts

// ✅ Export components
export { UsersTable } from './components/users-table';
export { UserForm } from './components/user-form';

// ✅ Export actions
export { getUsersAction, createUserAction, updateUserAction } from './actions';

// ✅ Export types
export type { User, CreateUserInput, UpdateUserInput } from './types';

// ✅ Export schemas (if needed)
export { userSchema } from './validations/user.schema';

// ❌ DON'T export internals
// hooks, stores, utils stay private
```

---

## 📝 Quy tắc đặt tên

### Files & Folders

| Type           | Convention    | Examples                              |
| -------------- | ------------- | ------------------------------------- |
| **Routes**     | `kebab-case`  | `page.tsx`, `layout.tsx`              |
| **Components** | `kebab-case`  | `user-form.tsx`, `data-table.tsx`     |
| **Actions**    | `kebab-case`  | `create-user.ts`, `get-users.ts`      |
| **Hooks**      | `use-*.ts`    | `use-auth.ts`, `use-debounce.ts`      |
| **Stores**     | `*-store.ts`  | `auth-store.ts`, `theme-store.ts`     |
| **Types**      | `kebab-case`  | `api.ts`, `user.ts`                   |
| **Schemas**    | `*.schema.ts` | `user.schema.ts`, `product.schema.ts` |
| **Utils**      | `kebab-case`  | `format.ts`, `validators.ts`          |

### Code Naming

```typescript
// ✅ Components - PascalCase
export function UserForm() {}
export const DataTable: React.FC = () => {};

// ✅ Functions - camelCase
export async function createUser() {}
export function formatDate() {}

// ✅ Server Actions - camelCase + "Action" suffix
export async function loginAction() {}
export async function createUserAction() {}

// ✅ Hooks - "use" + camelCase
export function useAuth() {}
export function useDebounce() {}

// ✅ Types - PascalCase
export type User = {};
export interface ApiResponse<T> {}

// ✅ Constants - UPPER_SNAKE_CASE
export const API_BASE_URL = '';
export const MAX_FILE_SIZE = 5242880;

// ✅ Route Groups - (lowercase)
(marketing, dashboard, auth);

// ✅ Private Folders - _lowercase
(_components, _lib, _utils);
```

---

## Tạo feature mới

```bash
# Template command
mkdir -p apps/web/features/{feature-name}/{components,actions,hooks,types,validations}
touch apps/web/features/{feature-name}/index.ts
```

---

## Tiếp theo

→ [05-code-patterns.md](./05-code-patterns.md) - Code Patterns
