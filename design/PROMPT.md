# Claude Design — Initial Prompt (copy the entire block below and paste into claude.ai/design)

---

Hi Claude — I need you to build a **design file** (multi-page, Figma-style) for TUTK's KDC Internal **Cloud AI settings module**. I'm the PM; this is my handoff to RD engineers.

## What to produce

A single design document with **8 labeled pages**, each at **1440×900** canvas size. Use the attached PNG screenshots as the visual source of truth — my working prototype is already pixel-matched to our production reference site, so treat those PNGs as spec, not inspiration.

Pages (keep these exact titles as frame labels):

1. **申請單管理 — 申請單列表** → `application-list.png`
2. **申請單管理 — 新增申請單** → `new-application.png`
3. **申請單管理 — 新增 VSaaS 使用申請單** → `vsaas-form.png`
4. **Cloud AI 設定 — VLM Profiles** → `cloud-ai-vlm-profiles.png`
5. **Cloud AI 設定 — Prompts** → `cloud-ai-prompts.png`
6. **Cloud AI 設定 — AI Plans** → `cloud-ai-plans.png`
7. **Cloud AI 設定 — Vendor AI Settings** → `cloud-ai-vendor.png`
8. **Design System** → `design-system.png`

## Design tokens (authoritative)

See attached `_design-tokens.json`. Key values:

- **Primary**: `#004480` (sidebar, titles)
- **Primary Alt**: `#00437E` (buttons, table headers)
- **Text**: `#333333`
- **Body BG**: `#f4f4f4`
- **Border**: `#e1e7f1`
- **Required marker**: `#f60b0b`
- **Brand orange**: `#e8652c` (TUTK logo, header decoration)
- **Font**: `PingFangTC`, fallback `Helvetica Neue, Helvetica, Arial, sans-serif`
- **Type scale**: navbarProduct 23px/600, title 20.8px/500, email 18px/400, table/sidebar/btn 16px, body 14px
- **Layout**: sidebar 220px, header 82px, footer 56px (fixed)

Logo: `_tutk-logo.png` (attached).

## How to structure the deliverable

- Every frame has its title label above it, left-aligned (matching the `SK_VMS_Web_Vendor/Dealer` reference style the RD team is used to)
- Group the 3 申請單管理 frames together, the 4 Cloud AI 設定 frames together, and Design System on its own
- Include a cover page with: project name ("KDC Internal — Cloud AI 模組"), PM name (Ronald Chen), date (2026-04-21), and a quick legend of the token palette

## Constraints

- **Do not invent** layouts I haven't shown. If a screenshot is authoritative, match it.
- **Do make** the frames editable (use actual Figma-style objects — text, rectangles, components — not just a flat image). If Claude Design's current capabilities only allow image-underlay, that's fine as a fallback, but ideally rebuild as editable elements.
- The **shell (header + sidebar + footer)** should be a reusable component — extract it so edits propagate.
- Leave Cloud AI-specific flows (AI Plans, Vendor AI Settings, VSaaS Cloud AI section) clearly annotated — these are new features; RD will want to know what's new vs what mirrors the existing KDC Internal shell.

## Output

Once done, I want to be able to share the design file as an internal URL with RD. Also a PDF export for the review meeting.

Attached files:
- `application-list.png`, `new-application.png`, `vsaas-form.png`, `cloud-ai-vlm-profiles.png`, `cloud-ai-prompts.png`, `cloud-ai-plans.png`, `cloud-ai-vendor.png`, `design-system.png` — 8 page screenshots at 1440×900
- `_tutk-logo.png` — official TUTK logo (456×164 PNG)
- `_design-tokens.json` — full design tokens in Tokens Studio format
