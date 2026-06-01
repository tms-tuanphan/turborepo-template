---
name: fe-generate-playwright-plan
description: Produce an E2E test plan (Playwright) from feature public API and user flows — does not write full test suite unless asked.
---

# Generate Playwright plan

## Delegate

- [test agent](../../../agents/test/SKILL.md) for runner detection and implementation
- Feature `index.ts` public exports

## Output

```markdown
### playwright_plan

- prerequisites: [auth fixture, seed data]
- specs:
  - name: ...
    steps: [goto, fill, click, expect]
    route: /...
- files_to_create: [e2e/<feature>.spec.ts]
- risks: [flaky selectors, i18n locales]
```

## Rules

- Prefer `data-testid` on critical controls (document in component PR)
- Cover happy path + one validation error + auth guard if protected route
- EN locale default; note JA if copy assertions differ

## Scope

Plan only — implementation requires user approval and existing Playwright setup in repo.
