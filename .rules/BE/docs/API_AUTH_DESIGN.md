# API AUTH DESIGN

Version: 1.0  
Architecture: Next.js (FE) · NestJS (BE) · PostgreSQL · Prisma

Scope: Admin authentication, session handling, RBAC, protected API.

## Endpoints (Phase 1–2)

| Method | Path                        | Auth       |
| ------ | --------------------------- | ---------- |
| POST   | `/api/auth/login`           | Public     |
| POST   | `/api/auth/logout`          | Public     |
| GET    | `/api/auth/me`              | JWT cookie |
| POST   | `/api/auth/register`        | Public     |
| POST   | `/api/auth/forgot-password` | Public     |
| POST   | `/api/auth/reset-password`  | Public     |
| POST   | `/api/auth/change-password` | JWT cookie |

### Register

- Always creates `role: sub_admin` (server-side; client cannot choose role).
- Returns `{ user }` (no session cookie).

### Forgot / reset password

- Forgot: anti-enumeration (`{ success: true }` always); rate limited per IP and email.
- Reset token: CSPRNG, SHA-256 hash in DB, 1h expiry, one-time use.
- Email via SMTP (Mailtrap in local dev); `APP_URL` builds reset link for FE.

### Change password

- Requires valid JWT cookie; verifies `currentPassword` before update.

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

`INVALID_CREDENTIALS`, `ACCOUNT_DISABLED`, `TOKEN_EXPIRED`, `UNAUTHORIZED`, `FORBIDDEN`, `EMAIL_ALREADY_EXISTS`, `INVALID_RESET_TOKEN`, `WEAK_PASSWORD`, `RATE_LIMITED`
