# 🧾 Dependency management (pnpm workspaces + Turborepo)

[← Về mục lục](./README.md) | [← Package + CI/CD](./07-package-cicd.md)

---

## Mục tiêu

- Cài dependency **đúng nơi nó được dùng** (đúng `app` / đúng `package`).
- Tránh “phình” root `package.json` một cách vô nghĩa.
- **Không để 1 thư viện bị add ở 2 nơi** (lãng phí + dễ lệch version + tăng thời gian install/build).

---

## Nguyên tắc vàng

### 1) Cài ở package/app nào dùng thì cài ở đó

- Nếu code trong `apps/web` import `zod` → cài `zod` vào `apps/web`.
- Nếu code trong `packages/ui` import `clsx` → cài `clsx` vào `packages/ui`.

### 2) Chỉ cài ở root khi đó là “repo-level tool”

Ví dụ: `turbo`, `prettier`, commit hooks, commitlint, tooling chạy cho toàn repo.

---

## Cách cài đúng chuẩn (bắt buộc dùng `--filter`)

> Luôn chạy từ **repo root**.

### Cài dependency runtime (dependencies)

```bash
pnpm add <pkg> --filter <workspace-name>
```

Ví dụ:

```bash
pnpm add zod --filter web
pnpm add clsx --filter @repo/ui
```

### Cài devDependency (devDependencies)

```bash
pnpm add -D <pkg> --filter <workspace-name>
```

Ví dụ:

```bash
pnpm add -D vitest --filter web
pnpm add -D eslint --filter @repo/ui
```

### Cài internal workspace dependency (giữ `workspace:*`)

```bash
pnpm add @repo/ui --filter web
```

Kết quả mong đợi: trong `apps/web/package.json` sẽ là:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

### Cài repo-level tool ở workspace root

```bash
pnpm add -D <tool> -w
```

Ví dụ:

```bash
pnpm add -D prettier -w
```

---

## Quy tắc “không add 1 thư viện ở 2 nơi” (bắt buộc)

### ✅ Đúng

- `packages/ui` dùng `clsx` → chỉ `packages/ui` khai báo `clsx`.
- `apps/web` dùng `next` → chỉ `apps/web` khai báo `next`.

### ❌ Sai (gây lãng phí / dễ lệch version)

- Cùng một thư viện (vd `zod`, `clsx`, `date-fns`, …) bị khai báo ở **root** và ở `apps/web`.
- Cùng một thư viện bị khai báo ở **`apps/web`** và **`packages/ui`** trong khi thực tế chỉ 1 nơi dùng.

### Cách xử lý khi lỡ bị trùng

- Xác định nơi “source of truth”: **nơi nào trực tiếp import** thư viện đó trong code.
- Giữ dependency ở đúng workspace đó, xoá ở workspace còn lại.
- Nếu nhiều workspaces cùng dùng:
  - Mặc định: cài ở từng workspace (đúng nơi dùng).
  - Chỉ cân nhắc đưa lên root nếu đó là tooling dùng cho toàn repo, hoặc policy team yêu cầu.

---

## Checklist trước khi merge (khuyến nghị)

### 1) Kiểm tra “trùng dependency”

Chạy search nhanh toàn repo để chắc chắn thư viện không bị khai báo lặp lại ở nhiều `package.json`.

Gợi ý lệnh:

```bash
# ví dụ kiểm tra zod có bị khai báo ở nhiều package.json không
rg "\"zod\"" -S "**/package.json"
```

### 2) Chạy pipeline chuẩn

```bash
pnpm lint
pnpm -r check-types
pnpm test
pnpm build
```
