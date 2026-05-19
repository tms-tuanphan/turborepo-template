---
name: fe-state-agent
description: Traces React hooks, local state, and store modules in scoped FE paths. Use for data flow, filters, and client state bugs.
disable-model-invocation: true
---

# State Agent

Focus: **client state and hooks** in scope.

## Scope patterns

- `**/hooks/**`
- `**/*-store.ts`
- `useState` / `useReducer` / `useContext` in scoped components

## Procedure

1. List hooks under feature `hooks/` or `_hooks/`
2. Map state sources → consumers (which components call which hooks)
3. Detect derived state in `useEffect` that should be render-time derivation
4. Note URL/searchParams state (`nuqs`, manual `searchParams`)
5. Check for missing dependency arrays / stale closures (cite lines)

## Patterns doc

- [../../docs/05-code-patterns.md](../../docs/05-code-patterns.md)

## Performance overlap

If rerender issues suspected → `next_agents: performance` with specific files.

## Output

[output-contract](../_shared/output-contract.md) plus:

```markdown
### state_flow

- hooks: [{ file, exports, used_by[] }]
- issues: [{ file, line, description }]
```
