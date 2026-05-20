# API AUTH DESIGN

Version: 1.0  
Architecture: Next.js (FE) · NestJS (BE) · PostgreSQL · Prisma

Scope: Admin authentication, session handling, RBAC, protected API.

## Endpoints (Phase 1–2)

| Method | Path               | Auth       |
| ------ | ------------------ | ---------- |
| POST   | `/api/auth/login`  | Public     |
| POST   | `/api/auth/logout` | Public     |
| GET    | `/api/auth/me`     | JWT cookie |

## JWT payload

```ts
{
  sub: string;
  email: string;
  role: 'admin' | 'sub_admin';
}
```

## Cookie

`httpOnly`, `secure` in production, `sameSite: 'lax'`, `path: '/'`, name from `AUTH_COOKIE_NAME` (default `access_token`).

## Error codes (I18nKey)

`INVALID_CREDENTIALS`, `ACCOUNT_DISABLED`, `TOKEN_EXPIRED`, `UNAUTHORIZED`, `FORBIDDEN`
