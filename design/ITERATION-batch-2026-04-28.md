# Claude Design — 批次更新 prompt（2026-04-28）

自上次 Claude Design 同步以來，KDC Cloud AI 設定模組累積了 **D-022 ~ D-030（共 9 項決策）** 的變更，本檔案彙整為一次性的更新指令。執行後 Frame 05 / 06 / 07 將與目前 Prototype 同步；Frame 00 / 01 / 02 / 03 / 04 / 08 不需動。

> 此檔取代之前的 `ITERATION-V1.5-AI-PLANS.md`、`ITERATION-V1.6-VENDOR-ZONE.md`、`ITERATION-V1.7-PROMPT-TEMPLATES.md`（保留為歷史記錄）。

對應 SPEC：HedgeDoc noteId `s0-kbgpQRkavK4jzlfJ51g` v1.11（2026-04-28）

---

## 更新前準備

1. 本機已執行 `npm run figma:frames`（attachments 已同步）
2. 將以下三張 PNG 拖入 Claude Design 對話框附件：
   - `design/attachments/cloud-ai-prompts.png`（Frame 05 新狀態）
   - `design/attachments/cloud-ai-plans.png`（Frame 06 新狀態）
   - `design/attachments/cloud-ai-vendor.png`（Frame 07 新狀態）
3. 開啟 https://claude.ai/design/p/843d5a59-6270-4a78-988c-2174e26d9a54

---

## 送入對話框的 prompt（一次性，整段貼入）

```
請依以下變更整批更新 Frame 05 / 06 / 07，其他 frames（00/01/02/03/04/08）保持不變。
範本 token：所有變更皆採用既有設計系統色票，請以 design tokens 為準。

═══════════════════════════════════════════
Frame 05 — Cloud AI 設定 — Prompt Templates
═══════════════════════════════════════════

(1) Tab 標題改名：「Prompts」→「Prompt Templates」
    - 第二個 tab 文字改名；右上角「+ 新增 Prompt」按鈕保持原文（單筆物件仍稱 Prompt）

(2) 新增「名稱重複」警告 Modal（以 callout / overlay 範例呈現）
    - 觸發：儲存時偵測 name 與其他 Prompt Template 重複
    - 標題：「名稱重複」
    - 訊息：「已存在名稱為『中文場景描述』的 Prompt Template，請改用其他名稱。」
    - 單一按鈕：「我知道了」（warning variant、無 cancel）

(3) 新增「JSON 格式錯誤」狀態（以 callout / overlay 範例呈現）
    - 編輯中失焦狀態：textarea 邊框 #d32f2f，下方 12px 紅字
      「JSON 格式錯誤：Expected double-quoted property name in JSON at position 23 (line 1 column 24)」
    - 儲存攔截 Modal：標題「JSON 格式錯誤」、訊息「Prompt 內容必須是合法的 JSON。請依下方紅字提示修正後再儲存。」、單鍵「我知道了」

═══════════════════════════════════════════
Frame 06 — Cloud AI 設定 — AI Plans
═══════════════════════════════════════════

【表格層級】
(4) 移除「UDID」欄位
    新欄位順序：項次 / 方案名稱 / VLM Profile / Daily Cap / Prompts / 說明 / Vendors / 功能

(5) 「功能」欄第一顆 icon 從鉛筆改為眼睛 icon（檢視）
    保留刪除（垃圾桶）icon

【檢視 Modal — 取代原編輯 Modal】
(6) 開啟條件：點眼睛 icon
    內容：方案名稱 / VLM Profile / Daily Cap / 說明 / Prompts 清單
    特性：
    - 唯讀（無編輯入口）
    - Prompts 清單為可展開行：點箭頭顯示該 prompt 的 promptBody（JSON 全文，monospace、灰底 pre）
    - 預設 prompt 行左側 4px 綠直條（#2e7d32）+ 綠色「預設」chip（#e8f5e9 底 / #2e7d32 字）
    - 非預設行顯示「源自：xxx」chip（#e8f0f8 底 / #004480 字）；若曾被改過 chip 後綴加紅字「・已修改」
    - 自建 prompt 顯示「自建」chip（#fff3e0 底 / #e65100 字）
    - 行尾顯示 snapshotAt 日期
    底部按鈕：只有「關閉」

【建立方案 Modal — 大改造】
(7) 全新「Prompts Builder」取代原本 checkbox + 上下移按鈕的設計
    架構：未排序卡片清單，每張卡片是「方案私有 PromptSnapshot」副本（建立時從模板深拷貝或自建）
    
    Builder header：
    - 左：「Prompts *（從模板加入或自建，皆為此方案私有副本；恰一個為預設執行）」
    - 右：兩顆白底藍邊小按鈕「+ 從模板加入」、「+ 自建 Prompt」

    每張卡片 header（左到右）：
    - 預設 radio：「○ 預設」label（同卡內勾選後 radio 填色）
    - 展開/收合箭頭（>>）
    - name input（可編輯，flex-1）
    - 預設 chip（僅當此卡為預設時顯示）：綠色「預設」
    - 來源 chip：「源自：xxx」（藍色，或加「・已修改」紅字後綴）/「自建」（橘色）
    - 移除 ×（IconClose）

    每張卡片展開後：
    - 「Prompt 內容（JSON）」label
    - textarea（monospace 12px、6 rows、resize-y）
    - 編輯失焦時若 JSON 無效：邊框紅、下方紅字錯誤訊息
    
    預設卡片視覺：左側 4px 綠直條（#2e7d32）+ header 綠 chip
    
    Builder footer 提示文字：「已加入 N 個 Prompt（綠色直條為預設）」

(8) 新增「從模板加入」picker Modal（以 callout / overlay 呈現）
    - 標題「從模板加入 Prompt」
    - 上方提示：「模板內容會被深拷貝為此方案的私有副本，加入後仍可編輯，且不會回寫模板。」
    - checkbox 列表（中文場景描述 / English Scene / 日本語シーン / 熊偵測（日文））
    - 底部「取消」/「加入 (N)」按鈕，未選擇時 disabled

【五個警告 Modal（以 callout / overlay 呈現）】
(9) 「無法刪除」（vendor-in-use guard，列表上點刪除）
    標題「無法刪除」、訊息「『熊出沒偵測』目前有 1 個 Vendor 使用中，請先到『Vendor AI 設定』將此方案移除後再刪除。」、單鍵「我知道了」

(10) 「無法刪除預設 Prompt」（builder 內點預設卡片 ×）
    標題「無法刪除預設 Prompt」、訊息「預設 Prompt 不可直接刪除，請先將其他 Prompt 設為預設後再刪除。」、單鍵「我知道了」

(11) 「Prompt 名稱重複」（builder 內方案內 name 衝突）
    標題「Prompt 名稱重複」、訊息「方案內已存在名稱為『中文場景描述』的 Prompt，請改用其他名稱。」、單鍵「我知道了」

(12) 「JSON 格式錯誤」（builder 內某卡片 body 無效）
    標題「JSON 格式錯誤」、訊息「以下 Prompt 的 JSON 格式無效，請修正後再儲存：中文場景描述、自建 Prompt」、單鍵「我知道了」

(13) 同 Frame 05 第 (3) 點 — JSON 錯誤的 textarea inline 紅框 + 紅字（適用於 builder 內每張卡片）

═══════════════════════════════════════════
Frame 07 — Cloud AI 設定 — Vendor AI Settings
═══════════════════════════════════════════

(14) 共用區（Shared Zone）保持不變

(15) Vendor 專屬區整段重構為 KDC「管理員設定 → 角色管理」同款 layout
     `grid-cols-[1fr_280px]` 左右分欄

【左側 Vendor 表格】
- 欄位順序：項次 / Vendor 名稱 / 專屬方案
- 「Vendor 名稱」欄兩行：主名稱（font-medium）+ VID 副標（灰色 12px）
- 「專屬方案」欄為**黑色 chip 清單**（對齊 KDC 角色 → 帳號 chip）：
  * 黑底 #2b2b2b、白字、圓角 14px、padding 10px/4px
  * 右側帶圓形 × 按鈕（#4a4a4a 底、白字、hover #666）
- 未綁定的 vendor 列顯示 placeholder「拖曳方案到此處」（13px 灰字）
- **沒有「功能」欄位**
- 表格底部分頁器（共 X 筆 / 10 筆/頁 / 頁碼）

【右側可選方案面板（寬 280px、sticky）】
- 最上方標題「**專屬方案**」置中（深色，表格標頭字級）
- 下方單一大框（白底、1px border、圓角 5px）
- 框內每列只顯示「方案名稱」純文字（**不顯示 VLM / Daily Cap 副標**）
- 列間細線分隔
- 內容 = 所有 AI Plans 扣掉 globalPlans
- 每列可拖曳（cursor: grab/grabbing）

【操作說明（標題下方）】
「從右側『可選的專屬方案』拖曳方案到左側對應 Vendor 列，或點 chip × 移除。」

【drop zone 視覺（可挑一列呈現拖曳中狀態）】
背景 #fff3e0 + 2px dashed #e65100 外框

═══════════════════════════════════════════
參考資源
═══════════════════════════════════════════

附件已上傳：
- design/attachments/cloud-ai-prompts.png（Frame 05 新狀態）
- design/attachments/cloud-ai-plans.png（Frame 06 新狀態，Builder 版）
- design/attachments/cloud-ai-vendor.png（Frame 07 新狀態，KDC role-management 風）
- 完整 SPEC：HedgeDoc s0-kbgpQRkavK4jzlfJ51g（v1.11）
- Live Prototype：https://kdc-cloud-ai-config.zeabur.app/cloud-ai

請整批更新 Frame 05 / 06 / 07；若任一變更影響其他 frame 請優先還原。
```

---

## 期望產出

- Frame 05 / 06 / 07 與 Prototype 像素級接近，並包含本批所有 Modal / 錯誤態 callouts
- Frame 00 / 01 / 02 / 03 / 04 / 08 不變

## 完成後

1. 在 Claude Design 內 File → Export PDF，覆蓋 `design/deliverables/KDC internal.pdf`
2. `git add design/deliverables/ && git commit && git push`

---

## 對應決策一覽（給好奇 Claude Design 的人對照用）

| 決策 | SPEC 版本 | 變更 |
|------|----------|------|
| D-022 | v1.5 | Prompts → Templates 模板語意；AI Plan 建立時深拷貝 |
| D-023 | v1.5 | AI Plan 移除 UDID + vendor-in-use guard |
| D-024 | v1.5 | AI Plan view-only + 眼睛 icon + 檢視 Modal |
| D-025 | v1.6 | Vendor 專屬區改 KDC 管理員樣式 + drag-drop |
| D-026 | v1.7 | Tab 改名 Prompt Templates + 名稱唯一警告 |
| D-027 | v1.8 | AI Plan builder（picker → builder + 自建 + 來源 chip） |
| D-028 | v1.9 | AI Plan prompts 預設機制 + 綠直條 + chip |
| D-029 | v1.10 | 預設 prompt 不可直接刪除（取代自動接管） |
| D-030 | v1.11 | promptBody JSON 格式驗證（兩處皆套用） |
