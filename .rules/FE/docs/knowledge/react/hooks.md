# Hooks

**When to use:** Client logic in `features/*/hooks/` or `shared/hooks/`.

**Repo pattern:**

- Data: TanStack Query hooks — not `useEffect` + fetch
- Feature hooks stay private unless exported via `index.ts`
- Core hooks (`use-mounted`) for infra only

**See also:** [fe-coding-react.mdc](../../../rules/fe-coding-react.mdc), [../data-fetching/react-query.md](../data-fetching/react-query.md)
