# Cross manifest mapping (FE ↔ BE)

[← Index](./README.md)

---

## Purpose

Link **FE feature manifests** to **BE module manifests** and shared **contract root** so coordinators scope fullstack tasks.

Location: [mappings/](../mappings/)

---

## Schema v1

```json
{
  "schemaVersion": 1,
  "id": "links",
  "feFeatureManifest": ".rules/FE/agents/feature/manifests/admin-blogs.json",
  "beModuleManifest": ".rules/BE/agents/module/manifests/links.json",
  "contractRoot": "packages/api/src/links",
  "notes": "optional"
}
```

| Field               | Required | Description                           |
| ------------------- | -------- | ------------------------------------- |
| `schemaVersion`     | yes      | Must be `1`                           |
| `id`                | yes      | Domain id                             |
| `feFeatureManifest` | no       | Path to FE manifest (omit if FE-only) |
| `beModuleManifest`  | no       | Path to BE manifest (omit if BE-only) |
| `contractRoot`      | no       | Shared `@repo/api` folder             |
| `notes`             | no       | Human context                         |

At least one of `feFeatureManifest` or `beModuleManifest` should be set.

---

## Validate

```bash
pnpm shared:mapping-check
```

---

## When adding a domain

1. Create/update FE manifest under `.rules/FE/agents/feature/manifests/`
2. Create/update BE manifest under `.rules/BE/agents/module/manifests/`
3. Add cross mapping JSON
4. Run `pnpm fe:manifest-check`, `pnpm be:manifest-check`, `pnpm shared:mapping-check`
