# Figma Handoff — KDC Cloud AI

This directory contains everything a designer (or PM acting as designer) needs to create the Figma file.

## Files

| File | Purpose |
|---|---|
| `tokens-studio.json` | Tokens Studio plugin import — colors, typography, sizing, component specs |
| `../public/tutk-logo.png` | Official TUTK logo (456×164 PNG) — downloaded from KDC prod |
| `../public/header-decoration.png` | Orange geometric pattern in header top-right |
| `../src/design-tokens.json` | Source of truth — edit this, then run `npm run build:tokens-studio` |

## Workflow

1. **Edit tokens** in `src/design-tokens.json`
2. **Regenerate** Figma-ready JSON: `npm run build:tokens-studio`
3. **Import into Figma** via Tokens Studio plugin (below)
4. **Re-sync** after any token change — never hand-edit colors in Figma

## Importing into Figma

### First-time setup

1. In Figma, install the **Tokens Studio for Figma** plugin (plugins menu → search "Tokens Studio")
2. Open the plugin on an empty Figma file
3. Click **Tools → Load from file** → select `figma/tokens-studio.json`
4. Plugin will show one token set: `global`
5. Click **"Apply to document"** — all colors / typography / sizing become Figma variables

### Sync updates

After any `src/design-tokens.json` change:

```bash
npm run build:tokens-studio
```

In Figma: Tokens Studio plugin → Tools → Load from file → pick the updated JSON → Apply.

## Frames (auto-generated)

Run `npm run figma:frames` to regenerate all PNG frames from `localhost:5173`. Output:

```
figma/frames/
├── manifest.json              ← page list + metadata
├── 1440x900/                  ← standard canvas
│   ├── application-list.png
│   ├── new-application.png
│   ├── vsaas-form.png
│   ├── cloud-ai-vlm-profiles.png
│   ├── cloud-ai-prompts.png
│   ├── cloud-ai-plans.png
│   ├── cloud-ai-vendor.png
│   └── design-system.png
└── 1920x1080/                 ← wide canvas (same pages)
```

Designer delivery pattern (mirrors `SK_VMS_Web_Vendor/Dealer` example):

1. Drag each PNG into Figma as an image-backed frame at its native size
2. Label each frame with its title from `manifest.json` (e.g., "申請單管理 — 新增 VSaaS 使用申請單")
3. Group frames into pages: **申請單管理**, **Cloud AI 設定**, **Design System**
4. (Optional, but recommended for editable frames) install `html.to.design` plugin and re-import from the live Zeabur URL — PNG frames remain as fallback/reference

## Token naming convention

- `color.kdc.*` — brand / semantic colors
- `fontSize.kdc*` — typography scale (kdcBody, kdcTable, kdcNavbarProduct, etc.)
- `sizing.*` — layout dimensions (sidebar, header, footer, iconLogout, etc.)
- `component.*` — composite component specs (header, sidebar, tab, button, etc.) — uses `{color.kdc.primary}` style references

## Single source of truth rule

**Never** let Figma and code drift. The rule is:

1. Code tokens (`src/design-tokens.json`) → Figma (via Tokens Studio)
2. Figma layouts → Code (via visual reference + PM review on `/design-system` page)

If Figma diverges, regenerate from `src/design-tokens.json`.
