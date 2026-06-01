---
name: fe-audit-accessibility
description: Run an accessibility checklist on scoped UI components. Delegates web-design-guidelines; use before reviewer on UI-heavy PRs.
---

# Audit accessibility

## Delegate

- [web-design-guidelines/SKILL.md](../../web-design-guidelines/SKILL.md)
- [docs/knowledge/ui/accessibility.md](../../../docs/knowledge/ui/accessibility.md)
- [fe-shadcn-ui.mdc](../../../rules/fe-shadcn-ui.mdc)

## Checklist

- [ ] Every input has associated `<label>` or `aria-label`
- [ ] Buttons have accessible name (text or aria-label)
- [ ] Focus order logical; focus visible on interactive elements
- [ ] Tables: header scope, keyboard reachability for sort/filter
- [ ] Loading/error/empty states announced or visible (not layout shift only)
- [ ] Color contrast sufficient (spot-check critical text)
- [ ] Dialogs: focus trap, Esc close, `aria-modal`

## Output

```markdown
### a11y_audit

- issues: [{ file, line, severity, description, fix }]
```

Severity: `blocking` | `warning` | `suggestion`

## Next

- UI fixes → implement → [reviewer agent](../../../agents/reviewer/SKILL.md)
