import { useState } from 'react';
import { useCloudAi } from '../../context/CloudAiContext';
import { IconPlus, IconClose } from '../../icons';
import Modal from '../../components/Modal';

// v1.16 起本 tab 僅管理共用方案；Vendor 專屬區已搬到客戶資訊頁面 Cloud AI tab（D-035）
// v1.19：(region, env) scope 化 — 每個 (region, env) 各自獨立的共用方案清單。
// v1.23：UI 用語從「全域方案」改為「共用方案」（D-041）；context state 仍叫 globalPlans 不動。
export default function VendorAiSettingsTab({ region, env }) {
  const { aiPlans, globalPlans, setGlobalPlans, vlmProfiles } = useCloudAi();
  const [showPicker, setShowPicker] = useState(false);

  function profileName(id) {
    return vlmProfiles.find(p => p.id === id)?.name || "—";
  }

  // 當前 (region, env) 下：已成為共用的 plan ids
  const scopedGlobalPlanIds = globalPlans.filter(pid => {
    const p = aiPlans.find(ap => ap.id === pid);
    return p && p.region === region && p.env === env;
  });
  // 當前 scope 下、尚未被加入共用的 plans（可被加入）
  const availablePlans = aiPlans.filter(
    p => p.region === region && p.env === env && !globalPlans.includes(p.id)
  );

  function addGlobalPlan(planId) {
    setGlobalPlans(prev => [...prev, planId]);
    setShowPicker(false);
  }

  function removeGlobalPlan(planId) {
    setGlobalPlans(prev => prev.filter(id => id !== planId));
  }

  return (
    <div>
      <h3 className="text-kdc-table font-medium text-kdc-primary mb-1 flex items-center gap-2">
        <span className="w-1 h-5 bg-kdc-primary rounded-sm inline-block" />
        共用方案（{region} / {env}）
      </h3>
      <p className="text-[12px] text-[#999] mb-3">
        所有客戶在此 ({region} / {env}) scope 下預設可用的 AI Plan 清單。客戶個別的專屬方案請至「客戶資訊」頁面該客戶的「Cloud AI」tab 設定。
      </p>

      <table className="w-full border-collapse text-kdc-table mb-3">
        <thead>
          <tr>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">方案名稱</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">VLM Profile</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-24">Daily Cap</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-20">功能</th>
          </tr>
        </thead>
        <tbody>
          {scopedGlobalPlanIds.map((planId, i) => {
            const plan = aiPlans.find(p => p.id === planId);
            if (!plan) return null;
            return (
              <tr key={planId} className={`hover:bg-[#e8f0f8] ${i % 2 === 1 ? 'bg-kdc-table-row-alt' : ''}`}>
                <td className="px-3 py-2.5 border-b border-kdc-border font-medium">{plan.name}</td>
                <td className="px-3 py-2.5 border-b border-kdc-border">
                  <span className="inline-block px-2.5 py-0.5 rounded-xl text-[13px] font-medium bg-[#e8f5e9] text-[#2e7d32]">
                    {profileName(plan.vlmProfileId)}
                  </span>
                </td>
                <td className="px-3 py-2.5 border-b border-kdc-border">
                  {plan.dailyCap === null ? "∞" : plan.dailyCap}
                </td>
                <td className="px-3 py-2.5 border-b border-kdc-border">
                  <button
                    className="bg-transparent border-none cursor-pointer text-kdc-text p-1 rounded hover:bg-[#e0e7ee] flex items-center"
                    title="移除"
                    onClick={() => removeGlobalPlan(planId)}
                  >
                    <IconClose />
                  </button>
                </td>
              </tr>
            );
          })}
          {scopedGlobalPlanIds.length === 0 && (
            <tr>
              <td colSpan={4} className="px-3 py-6 text-center text-kdc-body text-[#999]">
                此 ({region} / {env}) 尚無共用方案 — 點下方「加入方案」從本 scope 的 AI Plans 挑一個加入
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        className="bg-kdc-primary-alt text-white rounded-btn px-3.5 py-1.5 text-sm border border-kdc-border cursor-pointer inline-flex items-center gap-1.5 hover:opacity-85"
        onClick={() => setShowPicker(true)}
      >
        <IconPlus /> 加入方案
      </button>

      {showPicker && (
        <Modal
          title="加入共用方案"
          onClose={() => setShowPicker(false)}
        >
          {availablePlans.length === 0 ? (
            <p className="text-kdc-body text-[#999] text-center py-6">此 ({region} / {env}) 所有方案已加入共用區，或此 scope 下尚無 AI Plan</p>
          ) : (
            <div className="flex flex-col gap-2">
              {availablePlans.map(plan => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between px-3 py-2.5 border border-kdc-border rounded-[5px] hover:bg-[#e8f0f8]"
                >
                  <div>
                    <p className="text-kdc-table font-medium">{plan.name}</p>
                    <p className="text-[13px] text-[#999]">
                      VLM: {profileName(plan.vlmProfileId)} &nbsp;·&nbsp; Daily Cap: {plan.dailyCap === null ? "∞" : plan.dailyCap}
                    </p>
                  </div>
                  <button
                    className="bg-kdc-primary-alt text-white rounded-btn px-3 py-1 text-sm border border-kdc-border cursor-pointer hover:opacity-85"
                    onClick={() => addGlobalPlan(plan.id)}
                  >
                    加入
                  </button>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
