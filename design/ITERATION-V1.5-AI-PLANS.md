# Claude Design — v1.5 AI Plans frame 更新指令

SPEC v1.5（2026-04-22）對 AI Plans tab 做了三項變更（D-022 / D-023 / D-024）。此檔案記錄要給 Claude Design 的更新 prompt，使 Frame 06 與 Prototype 同步。

## 更新前請先做

1. 本機執行 `npm run figma:frames` 重新產出 `figma/frames/1440x900/cloud-ai-plans.png`
2. 確認 `design/attachments/cloud-ai-plans.png` 已為最新（本次已同步）
3. 開啟 https://claude.ai/design/p/843d5a59-6270-4a78-988c-2174e26d9a54

## 送入對話框的 prompt

```
請依 SPEC v1.5 更新 Frame 06（Cloud AI 設定 — AI Plans），其他 frame 不動。

三項變更：

1. 表格移除 UDID 欄位。新的欄位順序：
   項次 / 方案名稱 / VLM Profile / Daily Cap / Prompts / 說明 / Vendors / 功能

2. 「功能」欄的第一顆按鈕，從「編輯」鉛筆 icon 改為「檢視」眼睛 icon。
   點擊後開啟唯讀 Modal，顯示方案名稱 / VLM / Daily Cap / 說明 + Prompts
   清單；每個 prompt 有 toggle 展開按鈕，展開後顯示該 prompt 被快照時的
   promptBody JSON 全文與 snapshotAt 日期（如「快照於 2026-04-10」）。
   不提供編輯入口。

3. 刪除守衛改為 Vendor-in-use：若此方案被任何 Vendor 套用（在共用區或
   任一 Vendor 專屬區），點刪除 icon 時彈出「無法刪除」警告 Modal，訊息
   例：「『熊出沒偵測』目前有 1 個 Vendor 使用中，請先到『Vendor AI
   設定』將此方案移除後再刪除。」按鈕只有「我知道了」一顆（無取消鍵）。
   若 0 Vendor 使用則沿用既有刪除確認 Modal。

資料語意同步：Prompts 為 AI Plan 建立當下的深拷貝 snapshot，Prompts tab
後續編輯不影響既有 AI Plan（模板語意）。

附件已更新：
- design/attachments/cloud-ai-plans.png（新版 table + eye icon）
- 參考 Prototype：https://kdc-cloud-ai-config.zeabur.app/cloud-ai
```

## 期望產出

Frame 06 重生成後，表格與 Prototype 像素級一致；其餘 9 個 frame 保持不變。若 Claude Design 一併更新其他 frame，請手動還原。

## 後續動作

Frame 06 驗證 OK 後：
1. 匯出新版 PDF（File → Export PDF），覆蓋 `design/deliverables/KDC internal.pdf`
2. `git add design/` 並 commit
