import { useState } from 'react';
import VlmProfilesTab from './VlmProfilesTab';
import PromptsTab from './PromptsTab';
import AiPlansTab from './AiPlansTab';
import VendorAiSettingsTab from './VendorAiSettingsTab';

const tabs = ["VLM Profiles", "Prompts", "AI Plans", "Vendor AI Settings"];

export default function CloudAiSettings() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <h2 className="text-kdc-title font-medium text-kdc-primary mb-5">Cloud AI 設定</h2>
      <ul className="flex flex-wrap pl-5 m-0" role="tablist">
        {tabs.map((t, i) => (
          <li
            key={t}
            role="tab"
            aria-selected={activeTab === i}
            className={`cursor-pointer flex justify-center list-none mr-px min-w-[120px] px-8 py-2.5 relative tracking-[0.1rem] font-normal text-kdc-table rounded-t-[10px] border border-transparent border-b-0 transition-colors duration-150
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
      <div className="bg-white border border-kdc-border border-t-0 p-6 min-h-[400px]">
        {activeTab === 0 && <VlmProfilesTab />}
        {activeTab === 1 && <PromptsTab />}
        {activeTab === 2 && <AiPlansTab />}
        {activeTab === 3 && <VendorAiSettingsTab />}
      </div>
    </div>
  );
}
