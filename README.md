# KDC Internal POC — Multi-module Prototype

Functional prototype + design handoff for TUTK's KDC Internal tools. Maintained by Ronald Chen (PM).

> **命名沿用**：folder / GitHub repo 名稱仍為 `kdc-cloud-ai`，但實際範疇已擴展為 KDC Internal 多模組 prototype。
> Cloud AI 設定 為本 POC 起家的第一個模組，後續陸續加入其他 PM 後台功能。

## 模組

| 模組 | Route | 狀態 |
|------|-------|-----|
| Cloud AI 設定 | `/cloud-ai`（global templates）+ 客戶 detail → Cloud AI tab（per-customer 綁定） | ✓ |
| 客戶資訊 | `/customers`, `/customers/:id` | ✓ |
| 申請單管理 | `/applications`, `/applications/new`, `/applications/new/vsaas` | ✓ |
| **P2P Insight Trace 開通** | 客戶 detail → **P2P Insight** tab | ✓ (2026-05-13 新增) |
| Design System (dev only) | `/design-system` | ✓ |

- **Live prototype**: https://kdc-cloud-ai-config.zeabur.app
- **Functional SPEC (Cloud AI)**: HedgeDoc noteId `s0-kbgpQRkavK4jzlfJ51g`
- **Functional SPEC (P2P Insight Trace 開通)**: 新 spec 在 [BACKLOG.md](#) 連結中
- **Design file (Claude Design)**: see [`design/DELIVERABLES.md`](./design/DELIVERABLES.md)
- **姊妹專案**: [`xeither/kdc-external-poc`](https://github.com/xeither/kdc-external-poc) — 客戶面的 KDC external（P2P Insight Connection Trace 查詢端）

## Stack

React 19 · React Router 7 · Tailwind v4 (`@theme` in `src/index.css`) · Vite 5 · Docker (Zeabur)

## Directory

```
src/
├── design-tokens.json         ← single source of truth (Tokens Studio compatible)
├── index.css                  ← Tailwind @theme — mirrors design-tokens
├── pages/                     ← 4 top-level routes
├── layouts/                   ← KdcShell (header + sidebar + footer)
├── context/CloudAiContext.jsx ← domain model + fake data
├── components/
└── icons.jsx + sidebar-icons.jsx

design/                        ← Claude Design handoff bundle
├── DELIVERABLES.md            ← share URLs + PDF for RD
├── PROMPT.md / ITERATION-SCRIPT.md / WALKTHROUGH.md
├── attachments/               ← inputs used in the Claude Design session
└── deliverables/              ← PDF export

figma/                         ← Figma + visual-parity tooling
├── tokens-studio.json         ← import into Tokens Studio plugin
├── frames/{1440x900,1920x1080}/ ← PNG page screenshots
└── pixel-diff-*/ + dom-diff-*.json  ← reference-site comparison reports

scripts/                       ← build + diff tooling
├── auth-kdc.mjs
├── dom-diff.mjs
├── pixel-diff.mjs
├── build-tokens-studio.mjs
└── capture-figma-frames.mjs
```

## Scripts

```bash
npm run dev                     # local dev server (port 5173)
npm run build                   # production build
npm run start                   # serve dist (port 8080)
npm run auth:kdc                # one-time login to reference site (saves .auth/kdc.json)
npm run diff:pixel -- <ref> <ours> <outDir>
npm run diff:dom   -- <ref> <ours> <outPath>
npm run figma:frames            # regenerate PNG frames (1440x900 + 1920x1080)
npm run build:tokens-studio     # rebuild figma/tokens-studio.json from src/design-tokens.json
```

## Visual parity (vs https://wr-rd-kmp-aa.kalay.us)

| Page | Pixel diff (chromium @ 1440×900) |
|---|---|
| `/applications` | 1.81% |
| `/applications/new` | 3.18% |
| `/applications/new/vsaas` | 12.15% (content-driven, not layout) |
| `/cloud-ai` | 4.41% (content-driven, not layout) |

Shell consistency across all pages: email only (residual Δx=-1 Δy=+2), everything else matches.

## Related artifacts

- Skill for replicating KDC-like internal tools into new projects: `~/.claude/skills/replicate-website-visual/`
