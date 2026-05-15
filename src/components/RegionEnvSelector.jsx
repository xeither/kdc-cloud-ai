import { REGION_OPTIONS, ENV_OPTIONS } from '../data/customersData';

// 共用 (地區, 環境) 選擇器：Cloud AI 設定 page 與客戶 Cloud AI tab 共用。
// 概念：每個 (region, env) 對應到一個獨立 server，VLM Profiles / Prompts / AI Plans / 共用方案 完全隔離。
export default function RegionEnvSelector({ region, env, onRegionChange, onEnvChange }) {
  return (
    <div className="inline-flex items-center gap-2">
      <label className="text-kdc-body text-kdc-text">地區</label>
      <select
        className="h-8 border border-kdc-border rounded-[5px] px-2 text-kdc-table font-kdc bg-white outline-none cursor-pointer focus:border-kdc-primary min-w-[80px]"
        value={region}
        onChange={e => onRegionChange(e.target.value)}
      >
        {REGION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      <label className="text-kdc-body text-kdc-text ml-2">環境</label>
      <select
        className="h-8 border border-kdc-border rounded-[5px] px-2 text-kdc-table font-kdc bg-white outline-none cursor-pointer focus:border-kdc-primary min-w-[70px]"
        value={env}
        onChange={e => onEnvChange(e.target.value)}
      >
        {ENV_OPTIONS.map(en => <option key={en} value={en}>{en}</option>)}
      </select>
    </div>
  );
}
