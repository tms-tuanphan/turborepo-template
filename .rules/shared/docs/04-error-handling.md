# Error handling (fullstack)

[← Index](./README.md)

---

## Contract type

`ApiErrorPayload` in `packages/api/src/common/http/api-error.ts`:

| Field     | Purpose                                                         |
| --------- | --------------------------------------------------------------- |
| `code`    | Stable i18n key                                                 |
| `message` | Optional; may mirror code — FE should prefer translating `code` |
| `params`  | Interpolation (`min`, `max`, field names)                       |
| `details` | Validation field errors (optional)                              |
| `traceId` | Support correlation (server-generated)                          |

---

## BE (`apps/api`)

- Global filter maps `HttpException` → JSON body (see `common/filters/api-exception.filter.ts`)
- Default status → `I18nKey.Errors.Common.*` when message is not already a key
- Log full error server-side; never send stack to client

---

## FE (`apps/web`)

- Parse API error JSON from fetch/actions
- Use `code` + `params` with i18n helper
- Toast/inline errors — no raw DB messages

---

## Security

- No Prisma constraint names, SQL, or internal paths in response
- Tag `SECURITY_RISK` if sensitive data in error payload

Rule: [error-contract.mdc](../rules/error-contract.mdc)
