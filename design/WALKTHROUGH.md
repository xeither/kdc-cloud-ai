# 一步步帶你建立 KDC Cloud AI 的 Claude Design

## 你現在手上已經有

```
kdc-cloud-ai/design/
├── PROMPT.md              ← Step 3 要複製貼上的內容
├── ITERATION-SCRIPT.md    ← Step 5 的 6 輪精修劇本
├── WALKTHROUGH.md         ← 你正在看這份
└── attachments/           ← Step 4 要拖進去的所有檔案
    ├── application-list.png
    ├── new-application.png
    ├── vsaas-form.png
    ├── cloud-ai-vlm-profiles.png
    ├── cloud-ai-prompts.png
    ├── cloud-ai-plans.png
    ├── cloud-ai-vendor.png
    ├── design-system.png
    ├── _tutk-logo.png
    └── _design-tokens.json
```

## Step 1 — 開啟 Claude Design

1. 瀏覽器打開 **https://claude.ai/design**
2. 用你公司帳號（ronald_chen@tutk.com）登入
3. 檢查右上角是否顯示 **Claude Pro / Max / Team / Enterprise** 圖示 —— Claude Design 是 paid-tier 功能，免費帳號看不到
4. 點 **"New design"** 或類似的建立新設計按鈕

如果點進去後看到「Research preview」提示，接受條款繼續。

## Step 2 — 開啟新的 design document

第一次進去通常會看到歡迎頁，選「Start from scratch」或「Start with a prompt」。

## Step 3 — 貼 prompt

1. 打開 `kdc-cloud-ai/design/PROMPT.md`
2. 從 `Hi Claude — I need you to build...` 開始，**全選 `---` 下方的整段**（不要貼第一行標題和 `---`）
3. 貼到 Claude Design 的對話框，**先不要送出**

## Step 4 — 附加所有檔案

在還沒送出 prompt 之前：

1. 點對話框旁邊的 **📎 attachment / upload** icon
2. 從 `kdc-cloud-ai/design/attachments/` 資料夾選 **全部 10 個檔案**一次上傳：
   - 8 個 page PNG
   - `_tutk-logo.png`
   - `_design-tokens.json`

如果 Claude Design 對單次上傳檔案數有限制（例如只能 5 個），分兩批：
- 第一批先傳 3-4 個最關鍵的 PNG（`application-list`, `vsaas-form`, `cloud-ai-vlm-profiles`, `design-system`）+ logo + tokens
- 送出 prompt 之後，再用對話方式補貼其他 frames：「我再附上剩下 4 張 frames，請加進去」

## Step 5 — 送出 + 等第一版

送出後 Claude Design 會花 30 秒~幾分鐘產出第一版 design file。它會顯示在右側 canvas，你可以：
- 直接點任何元素拖、改字、換色
- 留 inline comment
- 用旁邊的 adjustment knobs 調 spacing / color / layout

**第一版通常不會 100% 準確。**這是正常的。進 Step 6。

## Step 6 — 照劇本精修

1. 打開 `kdc-cloud-ai/design/ITERATION-SCRIPT.md`
2. **依序**把每一輪的 prompt 貼到對話框送出（Round 1 → 2 → 3 → 4 → 5 → 6）
3. 每輪之間檢查結果。如果某輪 Claude 沒做好，用 ITERATION-SCRIPT.md 最後「如果卡住」表裡的修正語句

## Step 7 — 取得分享連結 + 匯出

Round 6 讓 Claude Design：

1. **產生 internal URL**：頂部有 Share 按鈕，選「Organization」權限，複製連結
2. **匯出 PDF**：File → Export → PDF（給 RD review 會議用）
3. **Handoff bundle → Claude Code**：如果你想把這份設計反向餵回來做 code 更新，點「Send to Claude Code」，它會打包一個 bundle 我可以讀

## Step 8 — 交給 RD

把 internal URL 和 PDF 貼到：

- JIRA ticket（KDCA 專案）
- 或 Email 給 RD 負責人

附一段話：

> 這是 Cloud AI 模組的功能規格設計稿，用 Claude Design 產出。live prototype 在 https://kdc-cloud-ai-config.zeabur.app 可以互動。規格書在 HedgeDoc noteId `s0-kbgpQRkavK4jzlfJ51g`。設計 token 定義在 GitHub repo `xeither/kdc-cloud-ai` 的 `src/design-tokens.json`，Figma Tokens Studio 匯入檔在 `figma/tokens-studio.json`。

---

## 如果卡住或 Claude Design 沒按預期動作

把錯誤訊息或奇怪輸出截圖回來給我，我幫你判斷。最常見狀況：

1. **Claude Design 不支援某個功能**（例如做不出 component 抽象）→ 跳過該輪，繼續做得到的
2. **Canvas 一直偏掉**（尺寸不對）→ 用 ITERATION-SCRIPT Round 1 的 prompt 強制修正
3. **字型 render 怪怪**（不支援 PingFangTC）→ 接受 Claude Design 預設字型，PDF 會保持正確
4. **上傳檔案太多被拒絕** → 照 Step 4 分兩批

## 完成後

回來告訴我 internal URL，我把它存進 `kdc-cloud-ai/design/DELIVERABLES.md` 作為專案交付紀錄，並更新 GitHub README 加上連結。
