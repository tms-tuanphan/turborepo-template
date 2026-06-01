# Authentication & Authorization (JWT + guards)

[← Mục lục](./README.md)

---

## Authentication (JWT)

Recommended:

- Access token: short-lived (15–30 minutes)
- Refresh token: long-lived (7–30 days)
- Refresh rotation: each refresh issues a new RT and revokes the old RT

Storage:

- Web: prefer HttpOnly cookie session pattern
- API clients: Bearer header acceptable when required
- Do not store tokens in `localStorage` for web

Claims verification:

- Always verify signature + expiry
- If configured, verify `iss` and `aud` consistently (do not skip)

Reference: `docs/API_AUTH_DESIGN.md`.

---

## Multi-tenant (when applicable)

Allowed tenant resolution sources:

- subdomain
- JWT claim
- header `X-Tenant-Id`

Implementation guideline:

- Resolve tenant early in middleware/guard, store it in a request-scoped context.
- Do not pass tenant id through arbitrary DTO fields.

---

## Authorization (RBAC + ownership + policy)

Rules:

- Role checks are necessary but not sufficient.
- Enforce resource ownership (e.g., users can only update their own resources) in a consistent, testable place.

Preferred approach:

- Guard-based checks (`CanActivate`) for authorization.
- Policy-based authorization (CASL or similar) for non-trivial systems.
- Avoid hardcoding policies in controllers.

GraphQL (if used):

- Apply authorization checks at resolver field-level too (do not assume parent resolver implies access).
