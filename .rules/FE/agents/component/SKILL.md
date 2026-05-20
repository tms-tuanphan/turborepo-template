---
name: fe-component-agent
description: Reviews React components, ShadcnUI usage, props, composition, and a11y in scoped UI paths. Use for UI implementation and design quality.
disable-model-invocation: true
---

# Component Agent

Analyze UI components within Coordinator scope (feature `components/`, `shared/`, `components/ui/`, `packages/ui/`).

## Delegate (read for standards, do not duplicate)

- [../../skills/frontend-design/SKILL.md](../../skills/frontend-design/SKILL.md)
- [../../rules/fe-shadcn-ui.mdc](../../rules/fe-shadcn-ui.mdc)
- [../../skills/web-design-guidelines/SKILL.md](../../skills/web-design-guidelines/SKILL.md) — a11y spot-check

## Checklist

- Props: destructure in signature; ~5–7 props max (guideline)
- Shadcn: reuse `components/ui` before new primitives
- Shared cross-app UI → `@repo/ui`
- Split large JSX into subcomponents
- **UX states:** loading, empty, error, disabled for lists/forms/async UI
- **Responsive:** tables/filters usable on typical admin viewport
- **a11y spot-check:** keyboard reachability, focus visible, labels on inputs/filters
- `asChild` + Radix patterns where applicable

## Output

[output-contract](../_shared/output-contract.md) plus:

```markdown
### component_audit

- components: [{ file, issues[], suggestions[] }]
```

## Forbidden

- Full-repo component inventory
- Backend or API logic (defer to `api` agent)
