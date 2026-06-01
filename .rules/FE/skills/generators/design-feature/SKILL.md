---
name: fe-design-feature
description: Design feature placement in 5-layer architecture, manifest fields, and file checklist. Use after analyze-requirements.
---

# Design feature

## Delegate

- [project-architecture/SKILL.md](../../project-architecture/SKILL.md)
- [docs/04-feature-module.md](../../../docs/04-feature-module.md)
- [fe-import-boundaries.mdc](../../../rules/fe-import-boundaries.mdc)
- [fe-services-layer.mdc](../../../rules/fe-services-layer.mdc)

## Output

```markdown
## Feature design

**Feature id:** kebab-case
**Manifest:** copy from agents/feature/manifests/\_template.json
**Routes:** app/(group)/...
**Folders:**

- features/<id>/components/
- features/<id>/services/
- features/<id>/actions/
- features/<id>/validations/
- features/<id>/hooks/ (if client cache)
  **Public exports (index.ts):** ...
  **Shared deps:** DataTable, layout, ...
  **Forbidden imports:** other features
```

## Next

- Scaffold → [generate-feature](../generate-feature/SKILL.md)
- Coordinator Large flow → [coordinator](../../../agents/coordinator/AGENTS.md)
