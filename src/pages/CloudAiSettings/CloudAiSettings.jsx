import { useState } from 'react';
import VlmProfilesTab from './VlmProfilesTab';
import PromptsTab from './PromptsTab';
import AiPlansTab from './AiPlansTab';
import VendorAiSettingsTab from './VendorAiSettingsTab';
import RegionEnvSelector from '../../components/RegionEnvSelector';

const tabs = ["VLM Profiles", "Prompts", "AI Plans", "全域方案"];

export default function CloudAiSettings() {
  const [activeTab, setActiveTab] = useState(0);
  // 4 個 tab 共用同一組 (region, env) — 切換時所有 tab 一起隔離
  const [region, setRegion] = useState("亞洲");
  const [env, setEnv] = useState("Prod");

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-kdc-title font-medium text-kdc-primary m-0">Cloud AI 設定</h2>
        <RegionEnvSelector
          region={region}
          env={env}
          onRegionChange={setRegion}
          onEnvChange={setEnv}
        />
      </div>
      <p className="text-[12px] text-[#999] mb-3 -mt-3">
        每個 (地區, 環境) 對應獨立的 server，VLM Profiles / Prompts / AI Plans / 全域方案 各自獨立。
      </p>
      <ul className="flex flex-wrap pl-[5px] m-0" role="tablist">
        {tabs.map((t, i) => (
          <li
            key={t}
            role="tab"
            aria-selected={activeTab === i}
            className={`cursor-pointer flex justify-center list-none mr-[5px] min-w-[50px] px-4 py-1.5 relative tracking-[0.1rem] font-normal text-kdc-table rounded-t-[10px] border border-transparent border-b-0 transition-colors duration-150
              ${activeTab === i
                ? 'bg-white text-kdc-primary-alt z-10'
                : 'bg-kdc-tab-unselected text-white'}`}
            style={{ transform: 'skew(-20deg)' }}
            onClick={() => setActiveTab(i)}
          >
            <span className="inline-block" style={{ transform: 'skew(20deg)' }}>{t}</span>
          </li>
        ))}
      </ul>
      <div className="bg-[#fafafa] rounded-[10px] p-[10px] min-h-[400px]">
        {activeTab === 0 && <VlmProfilesTab region={region} env={env} />}
        {activeTab === 1 && <PromptsTab region={region} env={env} />}
        {activeTab === 2 && <AiPlansTab region={region} env={env} />}
        {activeTab === 3 && <VendorAiSettingsTab region={region} env={env} />}
      </div>
    </div>
  );
}
