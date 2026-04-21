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

export const INITIAL_AI_PLANS = [
  { id: "plan-1", name: "看圖說故事", vlmProfileId: "vlm-1", dailyCap: 100, prompts: ["p-1", "p-2", "p-3"], description: "標準版，語系切換免費", boundUdidCount: 45, vendorCount: 3 },
  { id: "plan-2", name: "熊出沒偵測", vlmProfileId: "vlm-1", dailyCap: null, prompts: ["p-4"], description: "專用場景", boundUdidCount: 0, vendorCount: 1 },
  { id: "plan-3", name: "看圖說故事-中國區", vlmProfileId: "vlm-2", dailyCap: 100, prompts: ["p-1"], description: "中國區合規 VLM", boundUdidCount: 12, vendorCount: 2 },
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
