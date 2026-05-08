# 📦 Package.json + CI/CD

[← Về mục lục](./README.md) | [← Code Quality](./06-code-quality.md)

---

## Turborepo workflow (khuyến nghị)

Repo này dùng Turborepo, nên ưu tiên chạy scripts từ **repo root** để tận dụng cache + dependency graph.

```bash
# Dev (chạy các app/package có task dev)
pnpm dev

# Build theo dependency graph
pnpm build

# Lint / Test qua turbo pipeline
pnpm lint
pnpm test
```

> Khi cần chạy riêng FE app, bạn có thể chạy trong `apps/web` (ví dụ `pnpm dev`), nhưng root-level vẫn là chuẩn.

---

## `apps/web/package.json` (tham khảo)

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack --port 3001",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --max-warnings 0",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@repo/ui": "workspace:*",
    "next": "16.2.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@repo/api": "workspace:*",
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*"
  }
}
```

---

## 🚀 CI/CD Integration

### `.github/workflows/code-quality.yml`

```yaml
name: Code Quality

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # For commitlint

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm -r check-types

      - name: Format check
        run: pnpm format:check

      - name: Knip (unused code)
        run: pnpm knip

      - name: Commitlint (PR commits)
        if: github.event_name == 'pull_request'
        run: npx commitlint --from ${{ github.event.pull_request.base.sha }} --to ${{ github.event.pull_request.head.sha }} --verbose

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build
```

---

## NPM Scripts Reference

| Script         | Mô tả                         |
| -------------- | ----------------------------- |
| `dev`          | Chạy dev server với Turbopack |
| `build`        | Build production              |
| `start`        | Chạy production server        |
| `lint`         | Kiểm tra ESLint               |
| `lint:fix`     | Tự động fix ESLint errors     |
| `format`       | Format code với Prettier      |
| `format:check` | Kiểm tra format               |
| `typecheck`    | Kiểm tra TypeScript           |
| `test`         | Chạy tests với Vitest         |
| `test:ui`      | Chạy tests với UI             |
| `knip`         | Tìm unused code               |
| `knip:fix`     | Tự động xóa unused exports    |
| `prepare`      | Install Lefthook hooks        |

---

## Tiếp theo

→ [08-examples.md](./08-examples.md) - Ví dụ thực tế + Rules cho AI
