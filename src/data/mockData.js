export const INITIAL_VLM_PROFILES = [
  { id: "vlm-1", name: "gemini_standard", provider: "Gemini", modelVersion: "gemini-3.1-flash-lite_preview", description: "國際版標準場景，成本最低", refCount: 2 },
  { id: "vlm-2", name: "qwen_standard", provider: "Qwen", modelVersion: "qwen3-vl-plus", description: "中國區標準場景", refCount: 1 },
];

export const INITIAL_PROMPTS = [
  { id: "p-1", name: "中文場景描述", description: "繁體中文通用場景分析", tags: ["zh-TW", "通用"], promptBody: '{\n  "language": "zh-TW",\n  "instruction": "請描述畫面中的場景...",\n  "output_format": "structured"\n}', updatedAt: "2026-04-01" },
  { id: "p-2", name: "English Scene", description: "English general scene analysis", tags: ["en", "通用"], promptBody: '{\n  "language": "en",\n  "instruction": "Describe the scene...",\n  "output_format": "structured"\n}', updatedAt: "2026-04-01" },
  { id: "p-3", name: "日本語シーン", description: "日本語一般場面分析", tags: ["ja", "通用"], promptBody: '{\n  "language": "ja",\n  "instruction": "シーンを説明してください...",\n  "output_format": "structured"\n}', updatedAt: "2026-04-02" },
  { id: "p-4", name: "熊偵測（日文）", description: "熊出沒專用偵測場景", tags: ["ja", "垂直應用"], promptBody: '{\n  "language": "ja",\n  "instruction": "熊の存在を検出...",\n  "detection_target": "bear"\n}', updatedAt: "2026-04-03" },
];

// AI Plans 的 prompts 為「方案私有 PromptSnapshot」：建立當下從模板深拷貝 OR 由 PM 自建，
// Plan 內可繼續編輯不影響其他方案；sourceTemplateId 為 null 代表「自建」。
let __snapSeq = 0;
const snapshot = (sourceTemplateId, name, promptBody, snapshotAt = "2026-04-10") => ({
  id: `ps-${++__snapSeq}`,
  sourceTemplateId,
  sourceName: sourceTemplateId ? name : null,
  name,
  promptBody,
  snapshotAt,
  modified: false,
});

// AI Plan 的 prompts 為一組可在前端被使用者切換的選項，其中一個為「預設」（defaultPromptId）
const plan1Prompts = [
  snapshot("p-1", "中文場景描述", '{\n  "language": "zh-TW",\n  "instruction": "請描述畫面中的場景...",\n  "output_format": "structured"\n}'),
  snapshot("p-2", "English Scene", '{\n  "language": "en",\n  "instruction": "Describe the scene...",\n  "output_format": "structured"\n}'),
  snapshot("p-3", "日本語シーン", '{\n  "language": "ja",\n  "instruction": "シーンを説明してください...",\n  "output_format": "structured"\n}'),
];
const plan2Prompts = [
  snapshot("p-4", "熊偵測（日文）", '{\n  "language": "ja",\n  "instruction": "熊の存在を検出...",\n  "detection_target": "bear"\n}'),
];
const plan3Prompts = [
  snapshot("p-1", "中文場景描述", '{\n  "language": "zh-TW",\n  "instruction": "請描述畫面中的場景...",\n  "output_format": "structured"\n}'),
];

export const INITIAL_AI_PLANS = [
  {
    id: "plan-1",
    name: "看圖說故事",
    vlmProfileId: "vlm-1",
    dailyCap: 100,
    description: "標準版，語系切換免費",
    prompts: plan1Prompts,
    defaultPromptId: plan1Prompts[0].id,
  },
  {
    id: "plan-2",
    name: "熊出沒偵測",
    vlmProfileId: "vlm-1",
    dailyCap: null,
    description: "專用場景",
    prompts: plan2Prompts,
    defaultPromptId: plan2Prompts[0].id,
  },
  {
    id: "plan-3",
    name: "看圖說故事-中國區",
    vlmProfileId: "vlm-2",
    dailyCap: 100,
    description: "中國區合規 VLM",
    prompts: plan3Prompts,
    defaultPromptId: plan3Prompts[0].id,
  },
];

export const INITIAL_VENDORS = [
  { id: "v-1", name: "Wyze Labs", vid: "V:1234" },
  { id: "v-2", name: "SKT", vid: "V:5678" },
  { id: "v-3", name: "徠福科技", vid: "V:9012" },
];

export const INITIAL_GLOBAL_PLANS = ["plan-1", "plan-3"];

export const INITIAL_VENDOR_SETTINGS = {
  "v-1": { specificPlans: ["plan-2"] },
  "v-2": { specificPlans: [] },
  "v-3": { specificPlans: [] },
};
