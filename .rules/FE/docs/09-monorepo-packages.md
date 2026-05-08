# 📦 Monorepo packages (Turborepo) — đặt code vào đâu?

[← Về mục lục](./README.md)

---

## Mục tiêu

Trong Turborepo này:

- `apps/*` là **runtime apps** (chạy thật)
- `packages/*` là **shared libraries** (dùng chung, không chứa app wiring/routing)

Tài liệu này tập trung vào **`packages/ui`** và quy tắc quyết định **khi nào đưa UI vào package**.

---

## Quy tắc quyết định (ngắn gọn)

### 1) Để trong `apps/web` khi

- UI chỉ dùng cho riêng web app (một route/feature cụ thể).
- Component phụ thuộc trực tiếp vào **Next.js App Router** (ví dụ `next/navigation`, `next/link`, server actions, route params).
- Component gắn chặt vào business logic/feature của web app (không có khả năng reuse hợp lý).

### 2) Đưa vào `packages/ui` khi

- Component là **UI-only** (presentational), không biết gì về routing/business domain.
- Component được dùng lặp lại ở nhiều nơi và có khả năng reuse bền vững.
- Component không phụ thuộc đặc thù vào `apps/web` (không import code từ `apps/*`).

> Nếu mới chỉ có **1 chỗ dùng**, mặc định giữ ở `apps/web` trước. Chỉ “promote” sang `packages/ui` khi đã rõ reuse.

---

## `packages/ui` — scope (UI-only)

### ✅ Nên đặt vào `packages/ui`

- Primitive components / wrappers (button, card, dialog, dropdown…)
- Design-system components (layout primitives, typography primitives)
- Tiny UI utilities (className merging, variants) **nếu** thật sự UI-level

### ❌ Không đặt vào `packages/ui`

- API client, fetch wrappers, auth config
- Feature modules (users, auth, dashboard…)
- Next.js routing-level code (`app/`, `page.tsx`, `layout.tsx`, server actions)
- Domain/business rules

---

## Cách import (public API của package)

Repo này export UI từ `packages/ui/package.json` theo dạng:

- `@repo/ui/*` → `packages/ui/src/*.tsx`

Vì vậy, usage chuẩn là:

```ts
import { Button } from '@repo/ui/button';
```

### Quy tắc quan trọng

- **Không deep-import** sang file nội bộ ngoài những gì package export.
- `packages/ui` **không** được import từ `apps/*`.

---

## Gợi ý tổ chức trong `packages/ui`

Giữ API ổn định và dễ discover:

```
packages/ui/
├── src/
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── package.json
└── tsconfig.json
```

Khi số lượng component tăng, cân nhắc chuẩn hoá naming theo `kebab-case.tsx` và chỉ export những component “public”.
