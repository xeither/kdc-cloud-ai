# Claude Design — v1.6 Vendor 專屬區 frame 更新指令

SPEC v1.6（2026-04-22）對 Vendor AI Settings tab 的「Vendor 專屬區」做了 UI 重構（D-025），對齊 KDC Internal「管理員設定 → 角色管理」介面語彙。此檔案記錄要給 Claude Design 的更新 prompt，使 Frame 07 與 Prototype 同步。

## 更新前請先做

1. 本機執行 `npm run figma:frames` 重新產出 `figma/frames/1440x900/cloud-ai-vendor.png`
2. 確認 `design/attachments/cloud-ai-vendor.png` 已為最新（本次已同步）
3. 開啟 https://claude.ai/design/p/843d5a59-6270-4a78-988c-2174e26d9a54

## 送入對話框的 prompt

```
請依 SPEC v1.6 更新 Frame 07（Cloud AI 設定 — Vendor AI Settings），其他 frame 不動。

變更範圍：只動「Vendor 專屬區」整段，上方「共用區 — 全域預設方案」保持不變。

新 Vendor 專屬區 layout：grid-cols-[1fr_280px]

### 左側（主區）：Vendor 表格
- 欄位順序：項次 / Vendor 名稱 / 專屬方案
- 「Vendor 名稱」欄顯示兩行：主名稱（font-medium）+ VID 副標（灰色 12px）
- 「專屬方案」欄以黑色 chip 呈現（對齊 KDC 管理員設定 → 角色管理的「帳號」chip 樣式）：
  * 黑底 `#2b2b2b`、白字、圓角 14px、內距 10px/4px
  * chip 右側帶圓形 × 按鈕（`#4a4a4a` 底、白字、hover `#666`）
- 未綁定任一 chip 的 vendor 列，該儲存格顯示 placeholder「拖曳方案到此處」（13px 灰字）
- 沒有「功能」欄位
- 底部顯示分頁器（共 X 筆 / 10 筆/頁 / 頁碼），目前 3 筆顯示「共 3 筆」

### 右側（側欄，寬 280px，sticky）：可選的專屬方案面板
- 最上方標題「**專屬方案**」置中（表格標頭字級、深色）
- 下方單一大框（白底、1px border、圓角 5px）
- 框內每列只顯示「方案名稱」純文字，列間以細線分隔
- **不顯示 VLM / Daily Cap 等副標**
- 內容為所有 AI Plans 扣掉 globalPlans（目前範例只剩「熊出沒偵測」）
- 每列可拖曳（cursor 顯示 grab / grabbing）

### 操作說明（放在 Vendor 專屬區標題下方，小灰字）
「從右側『可選的專屬方案』拖曳方案到左側對應 Vendor 列，或點 chip × 移除。」

### drop zone 視覺
拖曳方案到某 vendor 列時，該列「專屬方案」儲存格以 `#fff3e0` 底 + `2px dashed #e65100` 外框高亮（靜態 frame 可挑一列呈現 drag-over 狀態作為語彙示範，或不畫，皆可）。

附件已更新：
- design/attachments/cloud-ai-vendor.png（新版 Vendor 專屬區）
- 參考 Prototype：https://kdc-cloud-ai-config.zeabur.app/cloud-ai → Vendor AI Settings tab
```

## 期望產出

Frame 07 重生成後，Vendor 專屬區與 Prototype 像素級一致；共用區（上半）及其餘 9 個 frame 保持不變。若 Claude Design 一併更新其他 frame，請手動還原。

## 後續動作

Frame 07 驗證 OK 後：
1. 匯出新版 PDF（File → Export PDF），覆蓋 `design/deliverables/KDC internal.pdf`
2. `git add design/` 並 commit
