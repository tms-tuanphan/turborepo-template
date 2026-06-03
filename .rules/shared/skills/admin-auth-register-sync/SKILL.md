---
name: shared-admin-auth-register-sync
description: Sync admin user creation across @repo/shared-validation, packages/api, apps/api admin-users, and apps/web BFF. Use when wiring or fixing admin-only sub_admin creation.
---

# Admin auth register sync (admin-only)

> Mapping: [mappings/admin-auth.json](../../mappings/admin-auth.json)  
> API design: [BE API_AUTH_DESIGN.md](../../../BE/docs/API_AUTH_DESIGN.md)  
> Contract skill: [api-contract-sync](../api-contract-sync/SKILL.md)

## Flow

1. **FE form** — `createAdminUserCreateSchema` (email, password, confirmPassword + i18n) in `admin-users`
2. **API body** — `toCreateAdminUserBody` → `registerRequestSchema` (`@repo/shared-validation`)
3. **BFF** — `POST /api/admin/users` → `fetchAdminApi('/admin/users')` (admin session required)
4. **BE** — `POST /api/admin/users` → `AdminUsersService.create` (`@Roles('admin')`, `sub_admin`, no cookie)

## Checklist

- [ ] Password rules: `PASSWORD_MIN_LENGTH`, `PASSWORD_REGEX` from `@repo/shared-validation`
- [ ] Errors: `errors.auth.emailAlreadyExists`, `errors.auth.weakPassword` mapped in UI toasts
- [ ] Success: redirect to `/admin/users`; no session cookie on create
- [ ] i18n: `admin.users` keys in `en.json`, `ja.json`, `vi.json`
- [ ] Public `POST /api/auth/register` removed; `POST /api/session/register` returns 403
- [ ] Menu **Users** visible only when `session.user.role === 'admin'`
- [ ] After contract change: `pnpm --filter @repo/api build` then api + web gates

## Do not

- Send `confirmPassword` to the API
- Let client choose `role` (server forces `sub_admin`)
- Expose public self-registration on `/admin/register` (redirect to login)
- Duplicate DTO in `apps/api` (use `packages/api`)
