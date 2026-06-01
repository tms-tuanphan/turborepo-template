# Security guidelines

[← Mục lục](./README.md)

---

## Password hashing

- Use bcrypt with rounds >= 10 (prefer 12+).
- Never log password, hashes, reset tokens, refresh tokens, or secrets.

---

## Secrets management

- Secrets must not be hardcoded in code.
- Do not commit `.env` with real values.
- Use CI/CD secrets (GitHub Secrets) or secret manager (Vault/AWS Secrets Manager).

---

## HTTP hardening

- Enable `helmet` for security headers.
- Configure CORS explicitly (allowlist origins), not `*` for authenticated apps.
- Apply rate limiting to public endpoints (login/forgot/reset/etc).

---

## SQL injection & raw queries

- Prisma queries are parameterized by default, but avoid interpolating user input into raw SQL.
- If raw queries are required, use parameterized APIs and strict input validation.

---

## Audit logs

Add audit logs for sensitive actions:

- login attempts
- password reset/change
- permission/role changes
- deletes/soft-deletes

Audit logs must:

- include `requestId`/correlation id and actor id
- omit secrets/PII beyond what is necessary
