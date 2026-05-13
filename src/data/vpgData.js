// ─────────────────────────────────────────────────────────────────────────
// P2P Insight — Trace 開通管理 mock data
//
// 資料模型：per-customer VPG 列表 + trace 上傳開關。
//   一個客戶名下可能有多組 VPG（依產品線拆分），每組 VPG 對應特定
//   realm/env，PM 可逐 VPG 開通 trace。
//
// 白名單管控：trace 開通會增加後端負載，僅針對試點客戶開放。
// 此 mock 假設 Wyze (V-1234) 已有一條開通紀錄供 demo。
// ─────────────────────────────────────────────────────────────────────────

export const REALM_OPTIONS = ["TUTK", "Wyze Labs", "SKT", "SK Broadband"];
export const ENV_OPTIONS = ["Prod", "STG", "RD"];

/**
 * Keyed by customer.id. Each entry is an array of VPG records.
 * VPG record shape:
 *   id        — VPG id（e.g. "1234"，對齊 customer.vid 前段）
 *   productLine — 對應產品線描述（PM 維護，便於識別）
 *   realm     — Realm（與 Cloud AI 模組共用 Realm 概念）
 *   env       — Prod / STG / RD
 *   traceEnabled — boolean
 *   enabledAt  — ISO date string（toggle 開啟時填入）
 *   enabledBy  — 操作 PM 帳號
 *   note       — 開通備註（選填）
 */
export const INITIAL_VPGS = {
  // Wyze Labs — 試點客戶，已開通一條 VPG 作為 demo
  "V-1234": [
    {
      id: "1234",
      productLine: "WyzeCam V3",
      realm: "Wyze Labs",
      env: "Prod",
      traceEnabled: true,
      enabledAt: "2026-05-13",
      enabledBy: "Ronald_Chen",
      note: "Beta 試點 — Wyze 排查連線問題用",
    },
    {
      id: "4660",
      productLine: "WyzeCam Outdoor",
      realm: "Wyze Labs",
      env: "Prod",
      traceEnabled: false,
      enabledAt: null,
      enabledBy: null,
      note: "",
    },
    {
      id: "4661",
      productLine: "WyzeCam Pan v3",
      realm: "Wyze Labs",
      env: "STG",
      traceEnabled: false,
      enabledAt: null,
      enabledBy: null,
      note: "",
    },
  ],
  // SKT — 尚未開通任何 VPG
  "V-5678": [
    {
      id: "5678",
      productLine: "SKT IPCam",
      realm: "SKT",
      env: "Prod",
      traceEnabled: false,
      enabledAt: null,
      enabledBy: null,
      note: "",
    },
  ],
};
