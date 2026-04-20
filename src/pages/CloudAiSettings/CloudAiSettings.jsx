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
      <div className="flex pl-[5px]">
        {tabs.map((t, i) => (
          <button
            key={t}
            className={`px-5 py-2 text-kdc-btn cursor-pointer rounded-t-[5px] border-none outline-none mr-0.5 transition-colors duration-150
              ${activeTab === i
                ? 'bg-kdc-tab-selected text-kdc-primary-alt font-medium'
                : 'bg-kdc-tab-unselected text-white'}`}
            onClick={() => setActiveTab(i)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="bg-white border border-kdc-border border-t-0 p-6 min-h-[400px]">
        {activeTab === 0 && <VlmProfilesTab />}
        {activeTab === 1 && <PromptsTab />}
        {activeTab === 2 && <AiPlansTab />}
        {activeTab === 3 && <VendorAiSettingsTab />}
      </div>
    </div>
  );
}
