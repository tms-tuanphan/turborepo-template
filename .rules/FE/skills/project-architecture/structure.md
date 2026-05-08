# Cấu trúc thư mục chi tiết

```
src/
├── app/                              # NEXT.JS APP ROUTER (routing only)
│   ├── (marketing)/                  # Route group: Public pages
│   │   ├── page.tsx                  # Homepage (/)
│   │   ├── about/page.tsx
│   │   ├── pricing/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (auth)/                       # Route group: Auth pages
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/                  # Route group: Protected area
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── new/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── webhooks/route.ts
│   │
│   ├── layout.tsx                    # Root layout
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   └── globals.css
│
├── components/
│   └── ui/                           # SHADCN/UI PRIMITIVES
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── table.tsx
│       └── ...
│
├── core/                             # CORE SYSTEM
│   ├── components/
│   │   ├── providers.tsx
│   │   ├── theme-provider.tsx
│   │   └── query-provider.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── api-client.ts
│   │   ├── auth.ts
│   │   └── query-client.ts
│   ├── hooks/
│   │   ├── use-mounted.ts
│   │   └── use-media-query.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── common.ts
│   │   └── index.ts
│   └── config/
│       ├── site.ts
│       ├── env.ts
│       └── navigation.ts
│
├── shared/                           # SHARED (cross-feature)
│   ├── components/
│   │   ├── data-table/
│   │   ├── forms/
│   │   ├── layout/
│   │   └── feedback/
│   ├── hooks/
│   │   ├── use-debounce.ts
│   │   ├── use-local-storage.ts
│   │   └── index.ts
│   ├── stores/
│   │   └── use-sidebar-store.ts
│   ├── validations/
│   │   └── common.schema.ts
│   └── utils/
│       ├── date.ts
│       └── format.ts
│
├── features/                         # BUSINESS FEATURES
│   ├── auth/
│   │   ├── index.ts
│   │   ├── components/
│   │   ├── actions/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── validations/
│   ├── users/
│   ├── dashboard/
│   └── settings/
│
└── middleware.ts
```

## Next.js Conventions

### Route Groups `(name)`

Organize routes without affecting URL:

- `(marketing)` → public pages
- `(auth)` → login/register pages
- `(dashboard)` → protected area

### Private Folders `_name`

Exclude from routing:

- `_components/` → NOT a route
- `_lib/` → NOT a route

### Dynamic Routes

- `[id]/page.tsx` → `/users/123`
- `[...slug]/page.tsx` → `/blog/a/b/c`

### Special Files

- `page.tsx` → Route page
- `layout.tsx` → Shared layout
- `loading.tsx` → Loading UI
- `error.tsx` → Error boundary
- `not-found.tsx` → 404 page
