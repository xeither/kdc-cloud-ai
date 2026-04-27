# Claude Design — v1.7 Prompt Templates frame 更新指令

SPEC v1.7（2026-04-27）對 Tab 2 做了兩項變更（D-026），需重新生成 Frame 05 使設計稿同步。

## 更新前請先做

1. 本機執行 `npm run figma:frames` 重新產出 `figma/frames/1440x900/cloud-ai-prompts.png`
2. 確認 `design/attachments/cloud-ai-prompts.png` 已為最新（本次已同步）
3. 開啟 https://claude.ai/design/p/843d5a59-6270-4a78-988c-2174e26d9a54

## 送入對話框的 prompt

```
請依 SPEC v1.7 更新 Frame 05（Cloud AI 設定 — Prompt Templates），其他 frame 不動。

兩項變更：

1. **Tab 標題改名**：原本第二個 tab「Prompts」改為「Prompt Templates」。
   - 注意：右上角「+ 新增 Prompt」按鈕文字保持不變（仍叫 Prompt，因為單筆物件仍稱 Prompt）
   - Modal 標題「新增 Prompt」/「編輯 Prompt」也保持不變

2. **新增名稱重複警告 Modal**（在 Frame 05 上以 overlay 形式呈現）：
   - 觸發時機：使用者在新增/編輯 Prompt 時，若輸入的名稱與現有 Prompt Template 重複，按下儲存時跳出此警告，並阻止寫入
   - Modal 樣式：
     * 標題：「名稱重複」
     * 訊息：「已存在名稱為『中文場景描述』的 Prompt Template，請改用其他名稱。」（範例文字）
     * 單一按鈕：「我知道了」（與 AI Plans「無法刪除」警告同款，warning variant）
     * 無 cancel 按鈕、× close 圖示置於右上角

附件已更新：
- design/attachments/cloud-ai-prompts.png（新版 tab 標題）
- 參考 Prototype：https://kdc-cloud-ai-config.zeabur.app/cloud-ai → Prompt Templates tab
```

## 期望產出

Frame 05 重生成後：
- Tab 標題顯示「Prompt Templates」
- 旁邊以 callout 或第二張畫面呈現名稱重複警告 Modal
- 其他 9 個 frames 保持不變

若 Claude Design 一併更新其他 frame，請手動還原。

## 後續動作

Frame 05 驗證 OK 後：
1. 匯出新版 PDF（File → Export PDF），覆蓋 `design/deliverables/KDC internal.pdf`
2. `git add design/` 並 commit
