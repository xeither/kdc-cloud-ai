// 每筆 VLM Profile / Prompt / AI Plan 都隸屬於某一個 (region, env) 組合。
// 同一概念（例：「看圖說故事」）若要在多個地區/環境提供，必須各自獨立建立記錄。
// 既有舊資料（vlm-1..2、p-1..4、plan-1..3）一律歸屬 (亞洲, Prod)。
// 其他 7 個 (region, env) 組合用 `_地區/環境` 後綴命名以區隔，便於 demo 隔離效果。

export const INITIAL_VLM_PROFILES = [
  // 亞洲 / Prod (既有)
  { id: "vlm-1", name: "gemini_standard", provider: "Gemini", modelVersion: "gemini-3.1-flash-lite_preview", description: "國際版標準場景，成本最低", refCount: 2, region: "亞洲", env: "Prod" },
  { id: "vlm-2", name: "qwen_standard", provider: "Qwen", modelVersion: "qwen3-vl-plus", description: "中國區標準場景", refCount: 1, region: "亞洲", env: "Prod" },
  // 美洲 / Prod
  { id: "vlm-5", name: "gemini_standard_美洲/Prod", provider: "Gemini", modelVersion: "gemini-3.1-flash-lite_preview", description: "美洲 Prod 標準", refCount: 1, region: "美洲", env: "Prod" },
  // 美洲 / STG
  { id: "vlm-6", name: "gemini_standard_美洲/STG", provider: "Gemini", modelVersion: "gemini-3.1-flash-lite_preview", description: "美洲 STG 測試", refCount: 1, region: "美洲", env: "STG" },
  // 中國 / Prod
  { id: "vlm-7", name: "qwen_standard_中國/Prod", provider: "Qwen", modelVersion: "qwen3-vl-plus", description: "中國 Prod 標準", refCount: 1, region: "中國", env: "Prod" },
  // 中國 / STG
  { id: "vlm-8", name: "qwen_standard_中國/STG", provider: "Qwen", modelVersion: "qwen3-vl-plus", description: "中國 STG 測試", refCount: 1, region: "中國", env: "STG" },
  // 亞洲 / STG
  { id: "vlm-9", name: "gemini_standard_亞洲/STG", provider: "Gemini", modelVersion: "gemini-3.1-flash-lite_preview", description: "亞洲 STG 測試", refCount: 2, region: "亞洲", env: "STG" },
  // 歐洲 / Prod
  { id: "vlm-11", name: "gemini_standard_歐洲/Prod", provider: "Gemini", modelVersion: "gemini-3.1-flash-lite_preview", description: "歐洲 Prod 標準", refCount: 1, region: "歐洲", env: "Prod" },
  // 歐洲 / STG
  { id: "vlm-12", name: "gemini_standard_歐洲/STG", provider: "Gemini", modelVersion: "gemini-3.1-flash-lite_preview", description: "歐洲 STG 測試", refCount: 1, region: "歐洲", env: "STG" },
];

export const INITIAL_PROMPTS = [
  // 亞洲 / Prod (既有)
  { id: "p-1", name: "中文場景描述", description: "繁體中文通用場景分析", tags: ["zh-TW", "通用"], promptBody: '{\n  "language": "zh-TW",\n  "instruction": "請描述畫面中的場景...",\n  "output_format": "structured"\n}', updatedAt: "2026-04-01", region: "亞洲", env: "Prod" },
  { id: "p-2", name: "English Scene", description: "English general scene analysis", tags: ["en", "通用"], promptBody: '{\n  "language": "en",\n  "instruction": "Describe the scene...",\n  "output_format": "structured"\n}', updatedAt: "2026-04-01", region: "亞洲", env: "Prod" },
  { id: "p-3", name: "日本語シーン", description: "日本語一般場面分析", tags: ["ja", "通用"], promptBody: '{\n  "language": "ja",\n  "instruction": "シーンを説明してください...",\n  "output_format": "structured"\n}', updatedAt: "2026-04-02", region: "亞洲", env: "Prod" },
  { id: "p-4", name: "熊偵測（日文）", description: "熊出沒專用偵測場景", tags: ["ja", "垂直應用"], promptBody: '{\n  "language": "ja",\n  "instruction": "熊の存在を検出...",\n  "detection_target": "bear"\n}', updatedAt: "2026-04-03", region: "亞洲", env: "Prod" },
  // 美洲 / Prod
  { id: "p-5", name: "場景描述_美洲/Prod", description: "美洲 Prod 通用場景", tags: ["en", "通用"], promptBody: '{\n  "language": "en"\n}', updatedAt: "2026-05-01", region: "美洲", env: "Prod" },
  // 美洲 / STG
  { id: "p-6", name: "場景描述_美洲/STG", description: "美洲 STG 通用場景", tags: ["en", "通用"], promptBody: '{\n  "language": "en"\n}', updatedAt: "2026-05-01", region: "美洲", env: "STG" },
  // 中國 / Prod
  { id: "p-7", name: "中文場景描述_中國/Prod", description: "中國 Prod 通用", tags: ["zh-CN", "通用"], promptBody: '{\n  "language": "zh-CN"\n}', updatedAt: "2026-05-01", region: "中國", env: "Prod" },
  // 中國 / STG
  { id: "p-8", name: "中文場景描述_中國/STG", description: "中國 STG 通用", tags: ["zh-CN", "通用"], promptBody: '{\n  "language": "zh-CN"\n}', updatedAt: "2026-05-01", region: "中國", env: "STG" },
  // 亞洲 / STG
  { id: "p-9", name: "中文場景描述_亞洲/STG", description: "亞洲 STG 通用", tags: ["zh-TW", "通用"], promptBody: '{\n  "language": "zh-TW"\n}', updatedAt: "2026-05-01", region: "亞洲", env: "STG" },
  // 歐洲 / Prod
  { id: "p-11", name: "場景描述_歐洲/Prod", description: "歐洲 Prod 通用", tags: ["en", "通用"], promptBody: '{\n  "language": "en"\n}', updatedAt: "2026-05-01", region: "歐洲", env: "Prod" },
  // 歐洲 / STG
  { id: "p-12", name: "場景描述_歐洲/STG", description: "歐洲 STG 通用", tags: ["en", "通用"], promptBody: '{\n  "language": "en"\n}', updatedAt: "2026-05-01", region: "歐洲", env: "STG" },
];

// AI Plan 的 prompts 為一組可在前端被使用者切換的 Prompt 參考（ID），順序具語意：
// 第一個（prompts[0]）即為「預設」。編輯 Prompt 會即時影響所有引用該 Prompt 的 AI Plan（live reference，非 snapshot）。
// AI Plan 必須使用同一 (region, env) 下的 VLM Profile 與 Prompts。
export const INITIAL_AI_PLANS = [
  // 亞洲 / Prod (既有)
  { id: "plan-1", name: "看圖說故事", vlmProfileId: "vlm-1", dailyCap: 100, description: "標準版，語系切換免費", prompts: ["p-1", "p-2", "p-3"], region: "亞洲", env: "Prod" },
  { id: "plan-2", name: "熊出沒偵測", vlmProfileId: "vlm-1", dailyCap: null, description: "專用場景", prompts: ["p-4"], region: "亞洲", env: "Prod" },
  { id: "plan-3", name: "看圖說故事-中國區", vlmProfileId: "vlm-2", dailyCap: 100, description: "中國區合規 VLM", prompts: ["p-1"], region: "亞洲", env: "Prod" },
  // 美洲 / Prod
  { id: "plan-5", name: "看圖說故事_美洲/Prod", vlmProfileId: "vlm-5", dailyCap: 100, description: "美洲 Prod 標準", prompts: ["p-5"], region: "美洲", env: "Prod" },
  // 美洲 / STG
  { id: "plan-6", name: "看圖說故事_美洲/STG", vlmProfileId: "vlm-6", dailyCap: 100, description: "美洲 STG 測試方案", prompts: ["p-6"], region: "美洲", env: "STG" },
  // 中國 / Prod
  { id: "plan-7", name: "看圖說故事_中國/Prod", vlmProfileId: "vlm-7", dailyCap: 100, description: "中國 Prod 標準", prompts: ["p-7"], region: "中國", env: "Prod" },
  // 中國 / STG
  { id: "plan-8", name: "看圖說故事_中國/STG", vlmProfileId: "vlm-8", dailyCap: 100, description: "中國 STG 測試", prompts: ["p-8"], region: "中國", env: "STG" },
  // 亞洲 / STG
  { id: "plan-9", name: "看圖說故事_亞洲/STG", vlmProfileId: "vlm-9", dailyCap: 100, description: "亞洲 STG 測試方案", prompts: ["p-9"], region: "亞洲", env: "STG" },
  { id: "plan-10", name: "熊出沒偵測_亞洲/STG", vlmProfileId: "vlm-9", dailyCap: null, description: "亞洲 STG 專案偵測", prompts: ["p-9"], region: "亞洲", env: "STG" },
  // 歐洲 / Prod
  { id: "plan-11", name: "看圖說故事_歐洲/Prod", vlmProfileId: "vlm-11", dailyCap: 100, description: "歐洲 Prod 標準", prompts: ["p-11"], region: "歐洲", env: "Prod" },
  // 歐洲 / STG
  { id: "plan-12", name: "看圖說故事_歐洲/STG", vlmProfileId: "vlm-12", dailyCap: 100, description: "歐洲 STG 測試", prompts: ["p-12"], region: "歐洲", env: "STG" },
];

// 全域方案清單 — plan id 本身已隱含 (region, env) scope，所以共用一份扁平清單即可。
// 每個 (region, env) 各自挑 0~N 個 global，篩選時用 plan 自帶的 region/env 過濾。
export const INITIAL_GLOBAL_PLANS = [
  "plan-1",   // 亞洲/Prod
  "plan-3",   // 亞洲/Prod
  "plan-5",   // 美洲/Prod
  "plan-7",   // 中國/Prod
  "plan-11",  // 歐洲/Prod
];
