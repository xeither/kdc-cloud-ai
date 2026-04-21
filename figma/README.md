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

## Frames to create in Figma

Use screenshots from localhost or the live prototype (`https://kdc-cloud-ai-config.zeabur.app`) as reference. Suggested frames:

| Frame | Reference |
|---|---|
| Login (not in scope, omit) | — |
| Application list | `/applications` |
| New application — category picker | `/applications/new` |
| VSaaS application form (full) | `/applications/new/vsaas` |
| Cloud AI Settings — VLM Profiles tab | `/cloud-ai` (tab 1) |
| Cloud AI Settings — Prompts tab | `/cloud-ai` (tab 2) |
| Cloud AI Settings — AI Plans tab | `/cloud-ai` (tab 3) |
| Cloud AI Settings — Vendor AI Settings tab | `/cloud-ai` (tab 4) |
| Design System reference | `/design-system` |

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
