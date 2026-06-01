# Client performance

**When to use:** List rerenders, expensive callbacks, transition-based loading.

**Repo pattern:**

- `useCallback` / `memo` when profiling shows benefit — [rerender-functional-setstate](../../../skills/vercel-react-best-practices/rules/rerender-functional-setstate.md)
- `useTransition` for non-urgent updates — [rendering-usetransition-loading](../../../skills/vercel-react-best-practices/rules/rendering-usetransition-loading.md)
- Derive state in render — [rerender-derived-state-no-effect](../../../skills/vercel-react-best-practices/rules/rerender-derived-state-no-effect.md)

**See also:** [../performance/README.md](../performance/README.md)
