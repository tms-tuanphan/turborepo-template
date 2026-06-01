---
name: fe-analyze-requirements
description: Break a user request into acceptance criteria, entities, and FE scope for apps/web. Use before design-feature or coordinator Large tier.
---

# Analyze requirements

## Input

User story, ticket, or informal feature request.

## Output (markdown)

```markdown
## Requirements

**Goal:** one sentence
**Users / roles:** ...
**Acceptance criteria:**

- [ ] ...
      **Entities:** User, Post, ...
      **UI surfaces:** pages, dialogs, tables
      **Mutations:** create/update/delete
      **i18n:** EN + JA copy needed? yes/no
      **Out of scope:** ...
      **Open questions:** ...
```

## Rules

- Map entities to `features/<name>/` — one feature per bounded context when possible
- Flag shared UI → `shared/` or `@repo/ui`
- Do not invent API endpoints — mark `TBD` if contract unknown; check `@repo/api`

## Next

- Architecture design → [design-feature](../design-feature/SKILL.md)
- Implementation → [coordinator AGENTS.md](../../../agents/coordinator/AGENTS.md)
