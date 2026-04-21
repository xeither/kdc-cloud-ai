# Iteration Script — refining the design in Claude Design

After the first pass, Claude Design usually needs 3–6 rounds of refinement. Use these prompts as-is. Paste one, wait for output, check, paste the next.

## Round 1 — Verify coverage

> 請確認你已經建立了所有 8 個 frames 並且按規格分組（申請單管理 3 張、Cloud AI 設定 4 張、Design System 1 張 + 封面）。如果有任何一頁漏掉或尺寸不對，現在補上。另外，請把所有 frames 放在同一個 canvas 上、左上角起排，讓我一眼看到全部。

## Round 2 — Make shell components

> 把每個 frame 上的 **header（TUTK logo + KDC Internal + email + logout）**、**sidebar（11 個選單項）** 和 **footer**，抽成三個獨立 component。主文件裡只出現 component instance。這樣我之後改 header 一次就全部生效。

## Round 3 — Annotate new vs existing

> 請在以下 frames 上加上紅色「NEW」標籤，指出是這次 Cloud AI 專案新加的東西（不是複製既有 KDC 頁面）：
>
> - `vsaas-form.png`：在 "Cloud AI 加值服務" 區塊加 NEW 標籤
> - `cloud-ai-vlm-profiles.png` 整頁 NEW
> - `cloud-ai-prompts.png` 整頁 NEW
> - `cloud-ai-plans.png` 整頁 NEW
> - `cloud-ai-vendor.png` 整頁 NEW
>
> 其他 frames（application-list, new-application）視為「mirrors KDC existing」不用加。

## Round 4 — Add flow arrows between pages

> 在 frames 之間畫流程箭頭，標示使用者動線：
>
> - 申請單列表 → 點「+新增」→ 新增申請單
> - 新增申請單 → 點「使用申請單」（VSaaS row）→ VSaaS 使用申請單表單
> - 側欄「Cloud AI 設定」→ Cloud AI 4 個 tab 頁面
>
> 箭頭用細線，灰色，不要搶主視覺。

## Round 5 — Cover page polish

> 封面加上：
>
> - 專案名稱（大）：**KDC Internal — Cloud AI 模組**
> - 副標：Functional Prototype for RD Handoff
> - PM：Ronald Chen
> - 日期：2026-04-21
> - Reference：live prototype at https://kdc-cloud-ai-config.zeabur.app
> - 色票圖例（左到右小色塊）：`#004480 primary`, `#00437E primary-alt`, `#658DB1 tab-unselected`, `#e8652c brand-orange`, `#f4f4f4 body-bg`, `#e1e7f1 border`, `#f60b0b required`
> - 字型說明：PingFangTC / Helvetica Neue

## Round 6 — Export

> 現在請：
>
> 1. 產生一個組織內部可分享的連結，我要傳給 RD
> 2. 匯出 PDF，用來開 review 會議
> 3. 如果可以，匯出 HTML handoff bundle 給 Claude Code

## 如果卡住

常見問題處理：

| 狀況 | 回覆 |
|---|---|
| Claude Design 產出的字型不對 | 「請改用 PingFangTC 作為主字型，fallback Helvetica Neue。所有文字都要改。」 |
| 色票變了 | 「請嚴格按 `_design-tokens.json` 裡的值，不要自己發揮。特別是 #004480 和 #00437E 不要混用。」 |
| Frame 比例錯 | 「每個 frame 嚴格 1440×900，不要自己調整 aspect ratio。」 |
| 加了不必要元素 | 「請移除 [X]。PNG 裡沒有的東西就不要加。」 |
| Shell 不一致 | 「請把 header/sidebar/footer 做成 component，同一份 instance 在所有 8 張 frame 重複使用。」 |
