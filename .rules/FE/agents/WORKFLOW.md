# FE task workflow — hướng dẫn follow chuẩn

Tài liệu này dành cho **bạn** và **Coordinator** khi làm task FE trong monorepo. Chi tiết orchestration: [coordinator/AGENTS.md](./coordinator/AGENTS.md).

---

## Khi nào dùng flow này?

| Tình huống                             | Cách làm                                             |
| -------------------------------------- | ---------------------------------------------------- |
| Sửa 1–2 file, rõ scope                 | Rules/skills trực tiếp — **không** spawn nhiều agent |
| Task trong 1 feature, biết manifest    | **Small / Medium** (bên dưới)                        |
| Screen mới, nhiều layer, cross-feature | **Large** + plan có checkpoint                       |
| Chỉ review PR                          | quality-gates (optional) → **reviewer**              |

---

## Bước 0 — Prompt cho Coordinator (Agent mode)

Copy và điền:

```text
Task FE: <mô tả ngắn>
Feature manifest: <admin-blogs | blogs | none>
Complexity (ước lượng): <small | medium | large> — ~<N> files
Expected: <hành vi mong đợi>
Rủi ro đã biết (optional): <pagination, URL sync, cache, ...>

Theo .rules/FE/agents/WORKFLOW.md và coordinator/AGENTS.md.
Sau implement: quality-gates (chạy lệnh nếu được phép) → reviewer cuối.
```

---

## Phân loại độ phức tạp (bắt buộc)

Coordinator **phải** chọn tier trước khi spawn Task.

| Tier       | Ước lượng                     | Discovery agents (tối đa)                                                                 | Ví dụ                               |
| ---------- | ----------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------- |
| **Small**  | &lt; 5 files, 1 concern       | **1** — thường chỉ `feature`                                                              | Fix typo i18n, sửa 1 schema         |
| **Medium** | 5–10 files, 1 feature         | **2–3** — `feature` + focused (`state` \| `api` \| `component` \| `validation` \| `i18n`) | Thêm filter + search                |
| **Large**  | &gt; 10 files hoặc screen mới | Full pipeline theo decision tree                                                          | Admin screen mới, refactor boundary |

**Không** chạy `repo-scanner` cho Medium nếu manifest đã rõ và team đã quen repo.

---

## 4 phase chuẩn

```text
Phase 1 — Discovery (readonly Task, scoped)
Phase 2 — Implement (Coordinator / agent chính, trong manifest.scope)
Phase 3 — quality-gates → reviewer (reviewer LUÔN cuối)
Phase 4 — UX / a11y spot-check (khi có UI trong diff)
```

### Phase 1 — Discovery

1. Đọc manifest: `.rules/FE/agents/feature/manifests/<id>.json`
2. Spawn Task theo [recipes](./coordinator/AGENTS.md) — chỉ agent tier cho phép
3. Coordinator ghi **Shared findings cache** (một lần, xem template AGENTS.md)
4. Sub-agent output = **advisory**; Coordinator quyết định cuối

### Phase 2 — Implement

- Chỉ sửa trong `manifest.scope` (+ `allowedImports`)
- Không grep cả `apps/web` khi đã có manifest
- Self-review nhanh: imports, i18n EN+JA, Zod trên actions

### Phase 3 — Đóng kỹ thuật

1. **quality-gates** — ưu tiên chạy thật:
   - `pnpm --filter web lint`
   - `pnpm --filter web check-types`
   - `pnpm --filter web build` ← bắt buộc khi đụng App Router / pages / actions
   - `pnpm knip` — nếu có ở root
   - `pnpm test` — khi `apps/web` đã có runner
2. **reviewer** — chỉ `git diff`, verdict + `severity` trên từng issue
3. Không mark done nếu `BLOCK` hoặc `REQUEST_CHANGES` với issue `blocking` / `major` chưa xử lý

### Phase 4 — UX / a11y (khi có UI)

Không cần agent riêng nếu đã chạy `component` ở discovery. Nếu không, reviewer + checklist:

- loading / empty / error / disabled
- keyboard + focus visible
- label / `aria-*` cho form & filter
- responsive cơ bản (admin table)

---

## Ma trận agent theo tier

### Small

```text
feature → implement → quality-gates → reviewer
```

### Medium (ví dụ: filter + search admin blogs)

```text
feature → state (hoặc api nếu chỉ backend) → implement
→ quality-gates → reviewer → UX spot-check nếu chưa có component
```

Optional song song (cùng phase, khác file): `validation` + `api` khi form + action cùng lúc.

### Large (screen / module mới)

```text
repo-scanner (nếu cần) → feature
→ route ∥ component
→ api + validation (nếu form/mutation)
→ i18n (nếu copy mới)
→ implement → test (plan) → quality-gates → reviewer
```

---

## Ownership (ai quyết gì)

| Vai trò         | Quyền                                                                                |
| --------------- | ------------------------------------------------------------------------------------ |
| **Sub-agents**  | Phân tích scoped, evidence, gợi ý — **không** bắt buộc implement                     |
| **Coordinator** | Merge findings, resolve conflict, chọn pattern (URL state vs store, v.v.), implement |
| **Reviewer**    | Verify diff vs rules; `APPROVE` / `REQUEST_CHANGES` / `BLOCK`                        |

Conflict giữa 2 sub-agent → Coordinator ghi `UNRESOLVED` hoặc chọn một hướng có evidence mạnh hơn — **không** blend hai pattern.

---

## Test — definition of done (tạm thời)

`apps/web` chưa có Vitest → agent `test` trả plan + `INSUFFICIENT_CONTEXT`.

| Layer          | Hiện tại                 | Khi có Vitest         |
| -------------- | ------------------------ | --------------------- |
| Zod / pure lib | Manual / test agent plan | Unit test             |
| Hooks          | Manual checklist         | Unit + RTL            |
| Server Actions | Manual + build           | Integration mock      |
| Page flow      | Manual / e2e sau         | Playwright (optional) |

---

## Checklist copy-paste (mỗi task)

```text
[ ] Chọn tier: small | medium | large
[ ] Manifest + scope xác nhận
[ ] Plan (nếu large hoặc ≥3 agents) — user OK
[ ] Phase 1: discovery ≤ max agents của tier
[ ] Shared findings cache đã ghi
[ ] Phase 2: implement trong scope
[ ] Phase 3: quality-gates (build!) → reviewer
[ ] Phase 4: UX/a11y nếu có UI
[ ] Verdict APPROVE hoặc đã fix và review lại
```

---

## Liên kết

- [coordinator/AGENTS.md](./coordinator/AGENTS.md) — decision tree, recipes, plan template
- [README.md](./README.md) — registry agents
- [\_shared/output-contract.md](./_shared/output-contract.md) — format output
