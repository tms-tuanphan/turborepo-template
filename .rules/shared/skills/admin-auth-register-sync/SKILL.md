---
name: shared-admin-auth-register-sync
description: Sync admin register flow across @repo/shared-validation, packages/api, apps/api auth, and apps/web BFF. Use when wiring or fixing POST register.
---

# Admin auth register sync

> Mapping: [mappings/admin-auth.json](../../mappings/admin-auth.json)  
> API design: [BE API_AUTH_DESIGN.md](../../../BE/docs/API_AUTH_DESIGN.md)  
> Contract skill: [api-contract-sync](../api-contract-sync/SKILL.md)

## Flow

1. **FE form** — `createAdminRegisterSchema` (email, password, confirmPassword + i18n)
2. **API body** — `toRegisterRequestBody` → `registerRequestSchema` (`@repo/shared-validation`)
3. **BFF** — `POST /api/session/register` → `proxyAuthPost('register')`
4. **BE** — `POST /api/auth/register` → `AuthService.register` (same schema, `sub_admin`, no cookie)

## Checklist

- [ ] Password rules: `PASSWORD_MIN_LENGTH`, `PASSWORD_REGEX` from `@repo/shared-validation`
- [ ] Errors: `errors.auth.emailAlreadyExists`, `errors.auth.weakPassword` mapped in `getAuthErrorMessage(..., 'register')`
- [ ] Success: redirect to login; no session cookie on register
- [ ] i18n: `admin.register` keys in `en.json`, `ja.json`, `vi.json` (incl. `errorNetwork`)
- [ ] After contract change: `pnpm --filter @repo/api build` then api + web gates

## Do not

- Send `confirmPassword` to the API
- Let client choose `role` (server forces `sub_admin`)
- Duplicate DTO in `apps/api` (use `packages/api`)
