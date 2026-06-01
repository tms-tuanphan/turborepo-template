# 🗂️ Nguyên tắc tổ chức code

[← Về mục lục](./README.md) | [← Project Structure](./02-project-structure.md)

---

## Nguyên tắc Next.js

### 1. Colocation

Files trong `app/` không tự động thành routes trừ khi có `page.tsx` hoặc `route.ts`:

```
app/
├── blog/
│   ├── _components/          # ✅ NOT routable (private folder)
│   │   └── post-card.tsx
│   ├── _lib/                 # ✅ NOT routable
│   │   └── data.ts
│   └── page.tsx              # ✅ ROUTABLE: /blog
```

### 2. Route Groups

Organize routes without affecting URL:

```
app/
├── (marketing)/              # Group: Public pages
│   ├── page.tsx              # URL: /
│   └── about/page.tsx        # URL: /about
│
├── (shop)/                   # Group: Shop section
│   ├── products/page.tsx     # URL: /products
│   └── cart/page.tsx         # URL: /cart
│
└── (dashboard)/              # Group: Admin area
    └── users/page.tsx        # URL: /users
```

Mỗi group có thể có `layout.tsx` riêng!

### 3. Private Folders

Prefix `_` để exclude khỏi routing:

```
app/
├── blog/
│   ├── _components/          # NOT a route
│   │   └── post.tsx
│   ├── _utils/               # NOT a route
│   │   └── format.ts
│   └── page.tsx              # /blog route
```

### 4. Dynamic Routes

```
app/
├── blog/
│   ├── [slug]/page.tsx       # /blog/my-post
│   └── [...slug]/page.tsx    # /blog/a/b/c (catch-all)
```

### 5. Parallel & Intercepted Routes

```
app/
├── @modal/                   # Parallel route (slot)
│   └── login/page.tsx
├── (.)photo/[id]/page.tsx    # Intercept (modal overlay)
└── layout.tsx
```

---

## Component taxonomy (ui / shared / feature)

| Loại        | Path                           | Rule                                                 |
| ----------- | ------------------------------ | ---------------------------------------------------- |
| **ui**      | `components/ui/`, `@repo/ui/*` | Pure presentational — no business logic, no fetch    |
| **shared**  | `shared/components/`           | Reusable across features (DataTable, layout shells)  |
| **feature** | `features/*/components/`       | Business UI — import feature public API from outside |

Rule: [fe-shadcn-ui.mdc](../rules/fe-shadcn-ui.mdc), [fe-services-layer.mdc](../rules/fe-services-layer.mdc)

---

## 🔐 Nguyên tắc Import

### Quy tắc vàng

```
APP → FEATURES → SHARED → CORE → COMPONENTS/UI
```

### ✅ ĐƯỢC PHÉP

```typescript
// App Router → Features
import { LoginForm } from '@/features/auth';
import { UserForm } from '@/features/users';

// Features → Shared
import { DataTable } from '@/shared/components/data-table';
import { useDebounce } from '@/shared/hooks/use-debounce';

// Features → Core
import { cn } from '@/core/lib/utils';
import { getSessionHeaders } from '@/core/services/auth-headers'; // prefer services over raw apiClient in features

// Features → own services (HTTP)
import { getUsers } from '@/features/users/services/user.service';

// Any layer → UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
```

### ❌ NGHIÊM CẤM

```typescript
// Feature A → Feature B (NEVER!)
import { LoginForm } from '@/features/auth'; // in features/users

// Core → Shared (Reverse dependency)
import { DataTable } from '@/shared/components/data-table'; // in core

// UI → Any layer
import { useAuth } from '@/shared/hooks/use-auth'; // in components/ui
```

### 📊 Dependency Matrix

| From → To    | UI  | Core | Shared | Features | App |
| ------------ | :-: | :--: | :----: | :------: | :-: |
| **UI**       | ✅  |  ❌  |   ❌   |    ❌    | ❌  |
| **Core**     | ✅  |  ✅  |   ❌   |    ❌    | ❌  |
| **Shared**   | ✅  |  ✅  |   ✅   |    ❌    | ❌  |
| **Features** | ✅  |  ✅  |   ✅   |   ❌\*   | ❌  |
| **App**      | ✅  |  ✅  |   ✅   |    ✅    | ✅  |

> \*Features không được import lẫn nhau

---

## Tiếp theo

→ [04-feature-module.md](./04-feature-module.md) - Cấu trúc Feature Module
