---
name: shared-admin-auth-forgot-password-sync
description: Sync admin forgot-password and reset-password across @repo/shared-validation, packages/api, apps/api auth, and apps/web BFF. Use when wiring or fixing password reset flow.
---

# Admin auth forgot / reset password sync

> Mapping: [mappings/admin-auth.json](../../mappings/admin-auth.json)  
> API design: [BE API_AUTH_DESIGN.md](../../../BE/docs/API_AUTH_DESIGN.md)  
> Contract skill: [api-contract-sync](../api-contract-sync/SKILL.md)  
> Register pattern: [admin-auth-register-sync](../admin-auth-register-sync/SKILL.md)

**Principle:** Optimize for consistency with the existing register flow over architectural perfection. Reuse register patterns (`createAdmin*Schema`, `to*RequestBody`, BFF proxy, `getAuthErrorMessage`) before inventing new abstractions.

---

## Auth authority boundary

- **Authentication authority remains in `apps/api` only** (`PasswordResetService`, JWT/cookies for login — unchanged).
- `apps/web` is UI + BFF transport only: forms, i18n, `session-client`, route handlers under `app/api/session/*`.
- **Do not** validate, decode, or verify reset tokens on the client. Token is opaque; only Nest checks hash/expiry/used state.
- **Do not** redesign existing login / logout / session / `proxy.ts` architecture for this task.

---

## Layer ownership

| Layer                        | Owns                                                        | Must not                                     |
| ---------------------------- | ----------------------------------------------------------- | -------------------------------------------- |
| `packages/api`               | DTOs, response types, `I18nKey`                             | Business logic, Prisma, SMTP                 |
| `packages/shared-validation` | Password rules, request body schemas                        | HTTP, UI                                     |
| `apps/api`                   | `PasswordResetService`, rate limit, mail port, transactions | Duplicate DTOs; direct FE imports            |
| `apps/web`                   | Feature UI, Zod forms, BFF routes, `session-client`         | Auth token verification; Nest business rules |

Cross-layer changes outside the scope list below require human / coordinator approval (`AUTH_BOUNDARY` in [06-fullstack-workflows](../../docs/06-fullstack-workflows.md)).

---

## Flow A — Forgot password

1. **FE form** — `adminForgotPasswordSchema` (email; optional i18n like register)
2. **API body** — `{ email }` → `ForgotPasswordDto` (`packages/api`)
3. **BFF** — `POST /api/session/forgot-password` → `proxyAuthPost('forgot-password')`
4. **BE** — `POST /api/auth/forgot-password` → `PasswordResetService.forgotPassword(dto, clientIp)`
5. **UX** — On HTTP 200 (`{ success: true }`), redirect `/{locale}/admin/forgot-password/sent?email=...` (anti-enumeration: same UX whether user exists)

## Flow B — Reset password (from email)

1. **FE page** — `/{locale}/admin/reset-password?token=...` (from email link; **do not** store token in `localStorage` / `sessionStorage`)
2. **FE form** — `adminResetPasswordSchema` (password + `confirmPassword`); map body via shared-validation when aligned with register
3. **API body** — `{ token, newPassword }` → `ResetPasswordDto` (**never** send `confirmPassword`)
4. **BFF** — `POST /api/session/reset-password` → `proxyAuthPost('reset-password')`
5. **BE** — `PasswordResetService.resetPassword` — `isValidPassword` from `@repo/shared-validation`
6. **UX** — Success → `/{locale}/admin/reset-password/success`; **manual login required** (no session cookie, no auto-login)

---

## BFF forwarding policy (`proxyAuthPost`)

BFF routes under `apps/web/app/api/session/*` must:

- Forward upstream **status codes** and JSON body transparently (no swallowing 429/401)
- Preserve **Set-Cookie** / **Clear-Cookie** from upstream when present (`getSetCookieHeaders`)
- Remain **transport only** — no token generation, no password hashing, no rate-limit logic
- Never expose reset tokens or passwords in logs, responses to unrelated clients, or client-side globals

Forgot/reset endpoints do not set session cookies on success; BFF must not add auth cookies locally.

---

## BE policies

### Anti-enumeration

- Unknown email, empty email, or `disabled` user → `{ success: true }` (HTTP 200)
- Only **rate limit** may return `429` + `errors.auth.rateLimited`

### Reset token

- CSPRNG plain token → SHA-256 hash in DB, 1h TTL, one-time use
- Invalidate previous unused tokens for same user when issuing a new one

### Rate limiting (ownership)

- Implemented in **`ForgotPasswordRateLimiter`** (`apps/api/src/auth/utils/forgot-password-rate-limiter.ts`) — in-memory, per IP + per email, used inside `PasswordResetService`
- **Do not** add Redis, Bull, or new gateway/middleware infra for this task unless explicitly requested

### Mail abstraction

- Delivery via **`PasswordResetMailer`** port (`PASSWORD_RESET_MAILER`); SMTP lives in `smtp-password-reset-mailer.service.ts`
- `PasswordResetService` must **not** import nodemailer or SMTP SDK directly

### Transactions

- Token create + invalidate old tokens: `$transaction`
- Password update + mark token used + cleanup other tokens: `$transaction` with re-read guard (concurrent reset)
- SMTP failure after token create: delete created token row; still return `{ success: true }` (no enumeration leak)

### Sensitive logging

- **Never** log reset token, password, SMTP credentials, or full auth request bodies in any environment

---

## FE policies

- Scope: [admin-auth.json](../../../FE/agents/feature/manifests/admin-auth.json)
- API calls only through `@/core/auth/session-client` (`forgotPasswordAdmin`, `resetPasswordAdmin`) — keep **reusable for future SSR / server actions** (thin wrapper, no browser-only globals in core)
- Errors: `getAuthErrorMessage(..., 'forgotPassword' | 'resetPassword')` + `I18nKey` in `auth-error.ts`
- i18n: `admin.forgotPassword`, `forgotPasswordSent`, `resetPassword`, `resetPasswordSuccess` in `en.json`, `ja.json`, `vi.json` (incl. `errorNetwork` where applicable)
- `proxy.ts`: `forgot-password` / `reset-password` remain public auth segments

---

## Implementation checklist

- [ ] Password rules (reset): `PASSWORD_MIN_LENGTH`, `PASSWORD_REGEX`, `isValidPassword` — align FE Zod + i18n hints with register (`createAdminResetPasswordSchema` / `toResetPasswordRequestBody` if adding shared schemas)
- [ ] Do not send `confirmPassword` to API
- [ ] Forgot: no “email not found” UI; map `rateLimited`, `errorGeneric`, network only
- [ ] Reset: map `invalidResetToken`, `weakPassword`, `unauthorized` → section messages
- [ ] Success reset → success page → user signs in manually (no cookie)
- [ ] Contract change → quality gates (order below)

## Test matrix (BE — add/extend `password-reset.service.spec.ts`)

- [ ] Forgot-password always returns `{ success: true }` for missing/disabled user
- [ ] Forgot-password returns 429 when rate limited (IP or email)
- [ ] Reset token expires after TTL
- [ ] Old unused token invalidated when new forgot issued
- [ ] Reused or invalid token → `invalidResetToken` / 401
- [ ] Successful reset does **not** issue session / JWT
- [ ] Weak password rejected (`weakPassword`)
- [ ] Concurrent reset: only one consumption wins

---

## Scope — only touch

- `packages/api/src/auth/dto/*forgot*`, `*reset*`
- `packages/shared-validation/src/auth/*` (if adding request schemas)
- `apps/api/src/auth/password-reset.service.ts`, `auth.controller.ts`, `mail/*`, `utils/forgot-password-rate-limiter.ts`, `utils/reset-token.util.ts`, `*.spec.ts`
- `apps/web/features/admin-auth/**`
- `apps/web/app/api/session/forgot-password/**`, `reset-password/**`, `_lib/proxy-auth-response.ts` (only if BFF contract changes)
- `apps/web/core/auth/session-client.ts`
- `apps/web/messages/{en,ja,vi}.json` (`admin.forgotPassword*`)

---

## Quality gates (strict order)

1. `pnpm --filter @repo/api build`
2. `pnpm --filter api lint` + `test` + `build`
3. `pnpm --filter web check-types` + `lint` + `build`

See [fullstack-quality-gates](../../rules/fullstack-quality-gates.mdc) and [BE COMMAND_POLICY](../../../BE/agents/_shared/COMMAND_POLICY.md).

---

## Do not

- Duplicate DTOs in `apps/api` (use `packages/api`)
- Return JWT or set session cookie after reset (manual login only)
- Let client choose `role` or bypass rate limits
- Decode or verify reset tokens in `apps/web`
- Log reset tokens, passwords, or sensitive auth payloads
- Hardcode Nest API URL in client components (BFF `/api/session/*` only)
- Redesign login / logout / register / cookie architecture
- Add Redis/Bull rate limiting in this task
- Import SMTP directly inside `PasswordResetService`

---

## Synced artifacts (reference)

- `forgotPasswordRequestSchema` / `resetPasswordRequestSchema` in `@repo/shared-validation`
- FE: `createAdminForgotPasswordSchema`, `createAdminResetPasswordSchema`, `toForgotPasswordRequestBody`, `toResetPasswordRequestBody`
- BE: `apps/api/src/auth/password-reset.service.spec.ts` (test matrix)
