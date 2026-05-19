---
name: fe-performance-agent
description: Analyzes React/Next.js performance in scoped paths using Vercel best-practice rules. Use for slow pages, bundle size, waterfalls, rerenders.
disable-model-invocation: true
---

# Performance Agent

Analyze performance **only within scoped paths** (feature manifest routes + feature root).

## Delegate (load selectively)

Base: [../../skills/vercel-react-best-practices/SKILL.md](../../skills/vercel-react-best-practices/SKILL.md)

Load **individual rule files** from `../../skills/vercel-react-best-practices/rules/` by prefix:

| Symptom             | Rule prefixes             |
| ------------------- | ------------------------- |
| Slow data / TTFB    | `async-`, `server-`       |
| Large bundle        | `bundle-`                 |
| Janky UI / spinners | `rerender-`, `rendering-` |
| Client fetch dupes  | `client-`                 |
| Hot loops           | `js-`                     |

**Do not** load full `AGENTS.md` (token-heavy).

## Procedure

1. Identify Server vs Client components in scope
2. Trace async/await chains in server components and actions
3. Check dynamic imports, barrel imports, heavy client libs
4. Note missing `loading.tsx` / Suspense boundaries
5. Rank findings by impact (CRITICAL → LOW per skill table)

## Output

[output-contract](../_shared/output-contract.md) plus:

```markdown
### performance_findings

- critical: [{ rule_id, file, evidence, recommendation }]
- high: []
- medium: []
```

## Forbidden

- Claiming CWV metrics without measurement data (mark hypothesis)
