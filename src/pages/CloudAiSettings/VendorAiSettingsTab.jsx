import { useState } from 'react';
import { useCloudAi } from '../../context/CloudAiContext';
import { IconPlus, IconClose } from '../../icons';
import Modal from '../../components/Modal';

export default function VendorAiSettingsTab() {
  const { aiPlans, globalPlans, setGlobalPlans, vendorSettings, setVendorSettings, vendors, vlmProfiles } = useCloudAi();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(vendors[0]?.id || "");

  function profileName(id) {
    return vlmProfiles.find(p => p.id === id)?.name || "—";
  }

  function planName(id) {
    return aiPlans.find(p => p.id === id)?.name || id;
  }

  // Plans not yet in global list
  const availablePlans = aiPlans.filter(p => !globalPlans.includes(p.id));

  function addGlobalPlan(planId) {
    setGlobalPlans(prev => [...prev, planId]);
    setShowPicker(false);
  }

  function removeGlobalPlan(planId) {
    setGlobalPlans(prev => prev.filter(id => id !== planId));
  }

  // Current vendor settings
  const vs = vendorSettings[selectedVendor] || { specificPlans: [] };

  function updateVS(patch) {
    setVendorSettings(prev => ({
      ...prev,
      [selectedVendor]: { ...vs, ...patch },
    }));
  }

  function addSpecificPlan(planId) {
    if ((vs.specificPlans || []).includes(planId)) return;
    updateVS({ specificPlans: [...(vs.specificPlans || []), planId] });
  }

  function removeSpecificPlan(planId) {
    updateVS({ specificPlans: (vs.specificPlans || []).filter(id => id !== planId) });
  }

  // Plans available to this vendor (global + vendor-specific)
  const vendorAvailablePlans = [...globalPlans, ...(vs.specificPlans || [])];

  // Plans that can be added as vendor-specific (not already global or specific)
  const addableSpecificPlans = aiPlans.filter(
    p => !globalPlans.includes(p.id) && !(vs.specificPlans || []).includes(p.id)
  );

  return (
    <div>
      {/* ── Shared Zone ── */}
      <div className="mb-8">
        <h3 className="text-kdc-table font-medium text-kdc-primary mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-kdc-primary rounded-sm inline-block" />
          共用區 — 全域預設方案
        </h3>

        <table className="w-full border-collapse text-kdc-table mb-3">
          <thead>
            <tr>
              <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-12">項次</th>
              <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">方案名稱</th>
              <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">VLM Profile</th>
              <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-24">Daily Cap</th>
              <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-20">功能</th>
            </tr>
          </thead>
          <tbody>
            {globalPlans.map((planId, i) => {
              const plan = aiPlans.find(p => p.id === planId);
              if (!plan) return null;
              return (
                <tr key={planId} className={`hover:bg-[#e8f0f8] ${i % 2 === 1 ? 'bg-kdc-table-row-alt' : ''}`}>
                  <td className="px-3 py-2.5 border-b border-kdc-border">{i + 1}</td>
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
            {globalPlans.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-kdc-body text-[#999]">尚無全域方案</td>
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
      </div>

      {/* ── Vendor Zone ── */}
      <div>
        <h3 className="text-kdc-table font-medium text-kdc-primary mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-[#e65100] rounded-sm inline-block" />
          Vendor 專屬區
        </h3>

        <div className="grid grid-cols-[auto_1fr] gap-6 items-start">
          {/* Left: Vendor selector */}
          <div className="flex items-center gap-3">
            <label className="text-kdc-body font-medium text-kdc-text whitespace-nowrap">選擇 Vendor：</label>
            <select
              className="h-9 border border-kdc-border rounded-[5px] px-2 text-kdc-table font-kdc bg-white outline-none cursor-pointer focus:border-kdc-primary"
              value={selectedVendor}
              onChange={e => setSelectedVendor(e.target.value)}
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.vid})</option>
              ))}
            </select>
          </div>

          {/* Right: vendor-specific plans */}
          <div className="border border-kdc-border rounded-[5px] min-h-[100px] p-3">
            <p className="text-kdc-body font-medium text-kdc-text mb-2">專屬方案</p>
            {(vs.specificPlans || []).length === 0 && (
              <p className="text-kdc-body text-[#999] text-[13px]">無專屬方案</p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {(vs.specificPlans || []).map(pid => (
                <span
                  key={pid}
                  className="inline-flex items-center gap-1 bg-[#fff3e0] text-[#e65100] px-2.5 py-0.5 rounded-xl text-[13px] font-medium"
                >
                  {planName(pid)}
                  <button
                    type="button"
                    className="bg-transparent border-none cursor-pointer text-[#e65100] leading-none flex items-center hover:opacity-70"
                    onClick={() => removeSpecificPlan(pid)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {addableSpecificPlans.length > 0 && (
              <div className="mt-3 pt-3 border-t border-kdc-border">
                <p className="text-[13px] text-[#999] mb-1.5">新增專屬方案：</p>
                <div className="flex flex-wrap gap-1.5">
                  {addableSpecificPlans.map(plan => (
                    <button
                      key={plan.id}
                      className="inline-flex items-center gap-1 bg-transparent border border-kdc-border text-kdc-text px-2.5 py-0.5 rounded-xl text-[13px] cursor-pointer hover:bg-[#e8f0f8]"
                      onClick={() => addSpecificPlan(plan.id)}
                    >
                      <IconPlus /> {plan.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Plan Picker Modal ── */}
      {showPicker && (
        <Modal
          title="加入全域方案"
          onClose={() => setShowPicker(false)}
        >
          {availablePlans.length === 0 ? (
            <p className="text-kdc-body text-[#999] text-center py-6">所有方案已加入共用區</p>
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
