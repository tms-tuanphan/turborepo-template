# Validation & DTO boundaries

[← Mục lục](./README.md)

---

## ValidationPipe

- Validate request payloads via Nest `ValidationPipe` + `class-validator`.
- Avoid manual validation in controller handlers (custom try/catch parsing).
- Prefer DTOs for `body`, `query`, and `params` where meaningful; avoid passing raw `req.query` down the stack.

---

## DTO responsibility

DTOs validate:

- required fields
- type/shape
- format (email/url/regex)
- min/max length, numeric ranges

DTOs must NOT validate:

- business rules (email exists? order cancellable? status transition allowed?)
- authorization (ownership) checks

Business rules belong in **service** (or domain layer if separated) and throw business errors (by stable code/i18n key).

---

## Separate DTOs per use case

- `CreateXDto` vs `UpdateXDto` vs `ListXQueryDto` should be separate when constraints differ.
- Avoid “one DTO fits all” that becomes overly permissive.

---

## Response shaping / sensitive fields

- Never expose internal fields (password hash, tokens, deletedAt, internal IDs) in HTTP responses.
- Prefer explicit mapping to `@repo/api` DTOs (recommended).
- If using class-transformer for responses:
  - `@Exclude()` on sensitive fields
  - `@Transform()` for derived fields
  - Ensure serialization is consistently applied (interceptors/transform settings)
