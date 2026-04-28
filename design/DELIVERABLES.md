# Deliverables — KDC Internal Cloud AI 模組 Design File

Handoff bundle for the RD team. Produced via [Claude Design](https://claude.ai/design) (Anthropic Labs, Opus 4.7) on 2026-04-21.

## Share links (Tutk org internal)

- **Interactive design file** (pan/zoom canvas, 10 editable React artboards):
  https://claude.ai/design/p/843d5a59-6270-4a78-988c-2174e26d9a54?file=KDC+Cloud+AI+-+Design+File.html&via=share

- **Standalone single-file HTML** (for email/Slack/GitHub mirroring):
  https://claude.ai/design/p/843d5a59-6270-4a78-988c-2174e26d9a54?file=KDC+Cloud+AI+-+Design+File+%28standalone%29.html

- **PDF** (one page per frame, for review meetings):
  [`design/deliverables/KDC internal.pdf`](./deliverables/KDC%20internal.pdf)

## Frames (10 artboards @ 1440×900)

| # | Frame | Annotation |
|---|---|---|
| 00 | Cover + Token Legend | project metadata, 8 token swatches |
| 01 | 申請單管理 — 申請單列表 | EXISTING (mirrors KDC shell) |
| 02 | 申請單管理 — 新增申請單 | EXISTING |
| 03 | 申請單管理 — 新增 VSaaS 使用申請單 | EXISTING + NEW CLOUD AI ROW |
| 04 | Cloud AI 設定 — VLM Profiles | NEW |
| 05 | Cloud AI 設定 — Prompt Templates | NEW — **批次更新 2026-04-28**：tab 改名 Prompt Templates、名稱重複警告、JSON 格式錯誤態 |
| 06 | Cloud AI 設定 — AI Plans | NEW — **批次更新 2026-04-28**：移除 UDID、view-only 檢視 Modal（含預設 chip + 來源 chip + JSON 展開）、Prompts Builder（從模板/自建、name 唯一、預設 radio + 不可刪除、JSON 驗證） |
| 07 | Cloud AI 設定 — Vendor AI Settings | NEW — **批次更新 2026-04-28**：Vendor 專屬區改 KDC 管理員風格（黑 chip table + 極簡側欄 + drag-drop） |
| 08 | Design System | reference |

All frames are **editable React components** (not image underlays). The shell (header / sidebar / footer) is a shared `<KdcShell>` component — edits propagate to every frame.

## What to tell RD

> 這是 Cloud AI 模組的完整設計稿，用 Claude Design 產出。
>
> - **Interactive**: 上面第一條連結，可以在 Tutk 組織內任意瀏覽、留言、檢視 React 元件結構
> - **Live prototype**: https://kdc-cloud-ai-config.zeabur.app  （與設計稿像素級一致）
> - **GitHub**: https://github.com/xeither/kdc-cloud-ai
> - **Functional SPEC**: HedgeDoc noteId `s0-kbgpQRkavK4jzlfJ51g`
> - **Design tokens**: `src/design-tokens.json`（Tokens Studio 相容，可匯入 Figma）
>
> Cloud AI 相關的新功能在橘色 **NEW** chip 標示處；既有 KDC shell 在藍色 **EXISTING** chip 標示處。VSaaS 使用申請單頁面的 "Cloud AI 加值服務" 那一列是唯一既有頁面裡新增的東西。

## Regenerating the deliverable (batched mode)

Per Ronald's preference, design assets are refreshed in batches — accumulate prototype changes + SPEC bumps, then run one consolidated update when explicitly requested.

**Latest batch**: [`design/ITERATION-batch-2026-04-28.md`](./ITERATION-batch-2026-04-28.md) — covers D-022 ~ D-030 (SPEC v1.5 ~ v1.11). Open it for the one-shot Claude Design prompt + which PNGs to attach.

Mechanics:
```bash
npm run figma:frames                                # refresh 16 PNG screenshots at 1440×900 and 1920×1080
# Sync the modified frames into design/attachments/
# then open https://claude.ai/design/p/843d5a59-6270-4a78-988c-2174e26d9a54
# attach the changed PNGs and paste the prompt from the latest ITERATION-batch-*.md
```

Older per-version files (`ITERATION-V1.5-AI-PLANS.md`, `ITERATION-V1.6-VENDOR-ZONE.md`, `ITERATION-V1.7-PROMPT-TEMPLATES.md`) are kept as historical record but **superseded** by the current batch file.

## Lessons (fed back into `replicate-website-visual` skill)

- Claude Design with `Attach codebase` + 8 screenshot attachments produces most of the 6-round refinement in a single pass. Future sessions: submit everything together and only iterate on caveats.
- Claude Design rebuilt frames as editable React components (not image underlays) when given source code. Always prefer `src/` attachment over raw images.
- The tool auto-annotated NEW vs EXISTING on its own when given semantic context ("Cloud AI is new work vs mirrored-from-existing") in the prompt — worth phrasing explicitly.
