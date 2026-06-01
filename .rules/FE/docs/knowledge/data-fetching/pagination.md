# Pagination

**When to use:** Admin tables, long lists.

**Repo pattern:**

- URL `searchParams` for page/size/sort when shareable — state agent + `nuqs` if adopted
- TanStack Table in `shared/components/data-table/`
- Service accepts `page`, `limit` — Zod in action/query parser

**See also:** [generate-table](../../../skills/generators/generate-table/SKILL.md)
