# Testing (NestJS)

[← Mục lục](./README.md)

---

## Pyramid

1. **Unit** — services, guards, pipes (most tests)
2. **Integration** — module wiring (fewer)
3. **E2E** — critical HTTP flows

---

## Factory pattern (required)

- No hardcoded DTO/entity literals in specs.
- `apps/api/test/factories/**/*.factory.ts`:
  - `create(overrides?)`, `createMany`, `createMinimal`
  - 2–3 presets per domain
  - deep copy

---

## AAA (required)

Every test:

```ts
// Arrange
// Act
// Assert
```

One behavior per test.

---

## Typed mocks

- `jest.fn()` on typed partials — no `any`.
- Shared mocks in `apps/api/test/helpers/**`.
- `afterEach(() => jest.clearAllMocks())`.

---

## Placement

| Type | Path                             |
| ---- | -------------------------------- |
| Unit | `apps/api/src/**/*.spec.ts`      |
| E2E  | `apps/api/test/**/*.e2e-spec.ts` |

Commands: `pnpm --filter api test`, `pnpm --filter api test:e2e`.

Skill: [testing-factory-aaa](../skills/testing-factory-aaa/SKILL.md) · Rule: [be-testing.mdc](../rules/be-testing.mdc)
