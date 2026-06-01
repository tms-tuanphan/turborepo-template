# Performance knowledge

**Rule summary:** [fe-performance.mdc](../../../rules/fe-performance.mdc) — RSC → Server Action → Client (`"use client"` last).

**Skill index:** [vercel-react-best-practices/SKILL.md](../../../skills/vercel-react-best-practices/SKILL.md)

## Topic → Vercel rule files

Load only rules matching the symptom (under `skills/vercel-react-best-practices/rules/`).

| Topic                      | Rules                                                                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Server fetch / cache       | `server-parallel-fetching`, `server-cache-react`, `server-cache-lru`, `server-serialization`, `server-dedup-props`                  |
| Server actions / auth      | `server-auth-actions`, `server-after-nonblocking`                                                                                   |
| Async / Suspense           | `async-parallel`, `async-dependencies`, `async-defer-await`, `async-suspense-boundaries`, `async-api-routes`                        |
| Bundle size                | `bundle-barrel-imports`, `bundle-dynamic-imports`, `bundle-defer-third-party`, `bundle-conditional`, `bundle-preload`               |
| Rerender                   | `rerender-memo`, `rerender-derived-state-no-effect`, `rerender-functional-setstate`, `rerender-transitions`, `rerender-defer-reads` |
| Rendering / hydration      | `rendering-hydration-no-flicker`, `rendering-hoist-jsx`, `rendering-content-visibility`, `rendering-usetransition-loading`          |
| Client listeners / storage | `client-event-listeners`, `client-passive-event-listeners`, `client-localstorage-schema`, `client-swr-dedup`                        |
| JS micro-opts              | `js-*` prefix files                                                                                                                 |

**Agent:** [performance agent](../../../agents/performance/SKILL.md)
