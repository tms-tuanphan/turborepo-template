# API design (REST + versioning + idempotency)

[← Mục lục](./README.md)

---

## HTTP semantics

- `GET`: read only, must not change state
- `POST`: create new resource / trigger command
- `PUT`: replace full resource (avoid for partial update)
- `PATCH`: partial update
- `DELETE`: delete / soft-delete

Guideline:

- Do not use `PUT` when you only update a subset → use `PATCH`.

---

## Status codes

Business failures must be 4xx (examples):

- `400` invalid input (validation)
- `401` unauthenticated
- `403` authenticated but forbidden
- `404` resource not found
- `409` conflict (unique constraint, state conflict)
- `422` semantically invalid request (optional; keep consistent across API)

Do not return HTTP 200 for business errors.

---

## Versioning

Allowed:

- URL: `/v1/users`
- Or `Accept` header versioning (when standardized across consumers)

Forbidden:

- `?version=1` query param

---

## Idempotency for critical writes

For write endpoints with externally visible side effects (payments, order creation, webhook replay, etc.):

- Support `Idempotency-Key` header.
- Persist mapping (`Idempotency-Key` → response/result) with TTL.
- Same key + same endpoint must return same result; conflicting payloads should be rejected (`409`).

---

## Error payload (backend contract)

Project standard: error responses must be **structured** and include correlation/request id.

Recommended shape:

```json
{
  "statusCode": 400,
  "message": "validation.user.email.isEmail",
  "error": "Bad Request",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "path": "/api/v1/users",
  "requestId": "uuid"
}
```

Notes:

- `message` should be an i18n key (or stable error code) — no raw DB messages.
- Keep any additional info under a structured `details` field if needed; do not leak secrets/PII.
