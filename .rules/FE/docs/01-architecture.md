# 🎯 Tổng quan kiến trúc

[← Về mục lục](./README.md)

---

## Kiến trúc 5 tầng

Kiến trúc này kết hợp **Next.js conventions** với **modular pattern**, chia ứng dụng thành **5 tầng độc lập**:

```
┌─────────────────────────────────────────┐
│  APP (Next.js App Router)               │  ← Entry point
│  Routes, layouts, pages                 │
└─────────────────────────────────────────┘
              ↓ imports from
┌─────────────────────────────────────────┐
│  FEATURES (Business Modules)            │  ← Business logic
│  auth, users, products, orders...       │
└─────────────────────────────────────────┘
              ↓ imports from
┌─────────────────────────────────────────┐
│  SHARED (Cross-Feature Code)            │  ← Reusable across features
│  Components, hooks, stores...           │
└─────────────────────────────────────────┘
              ↓ imports from
┌─────────────────────────────────────────┐
│  CORE (Foundation)                      │  ← App infrastructure
│  Providers, lib, config, types          │
└─────────────────────────────────────────┘
              ↓ imports from
┌─────────────────────────────────────────┐
│  COMPONENTS/UI (ShadcnUI)               │  ← UI primitives
│  Button, Input, Card, Dialog...         │
└─────────────────────────────────────────┘
```

### Mô tả từng tầng

| Tầng         | Thư mục                   | Mục đích                          |
| ------------ | ------------------------- | --------------------------------- |
| **APP**      | `apps/web/app/`           | Next.js routing, layouts, pages   |
| **FEATURES** | `apps/web/features/`      | Business modules độc lập          |
| **SHARED**   | `apps/web/shared/`        | Code dùng chung giữa features     |
| **CORE**     | `apps/web/core/`          | Infrastructure, config, providers |
| **UI**       | `apps/web/components/ui/` | ShadcnUI primitives               |

---

## 📦 Tech Stack

### Core

| Category      | Library    | Version | Mục đích                      |
| ------------- | ---------- | ------- | ----------------------------- |
| **Framework** | Next.js    | 16+     | App Router, Server Components |
| **Language**  | TypeScript | 5+      | Type safety                   |
| **Runtime**   | React      | 19+     | UI library                    |

### UI & Styling

| Category       | Library             | Mục đích               |
| -------------- | ------------------- | ---------------------- |
| **Components** | ShadcnUI            | Radix-based components |
| **Styling**    | Tailwind CSS        | Utility-first CSS      |
| **Icons**      | Lucide React        | Icon library           |
| **Animations** | tailwindcss-animate | CSS animations         |

### Forms & Validation

| Category       | Library         | Mục đích              |
| -------------- | --------------- | --------------------- |
| **Forms**      | React Hook Form | Form state management |
| **Validation** | Zod             | Schema validation     |

### State & Data

| Category         | Library        | Mục đích                |
| ---------------- | -------------- | ----------------------- |
| **Server State** | TanStack Query | Data fetching & caching |
| **Client State** | Zustand        | Global state management |
| **Tables**       | TanStack Table | Data tables             |

### Authentication

| Category | Library        | Mục đích       |
| -------- | -------------- | -------------- |
| **Auth** | NextAuth.js v5 | Authentication |

### Code Quality

| Category        | Library    | Mục đích             |
| --------------- | ---------- | -------------------- |
| **Git Hooks**   | Lefthook   | Fast git hooks       |
| **Commit Lint** | Commitlint | Conventional commits |
| **Unused Code** | Knip       | Dead code detection  |
| **Linting**     | ESLint     | Code linting         |
| **Formatting**  | Prettier   | Code formatting      |
| **Testing**     | Vitest     | Unit testing         |

### Utilities

| Category  | Library              | Mục đích            |
| --------- | -------------------- | ------------------- |
| **Dates** | date-fns             | Date manipulation   |
| **Toast** | Sonner               | Toast notifications |
| **Utils** | clsx, tailwind-merge | Class utilities     |

---

## Tiếp theo

→ [02-project-structure.md](./02-project-structure.md) - Cấu trúc thư mục chi tiết
