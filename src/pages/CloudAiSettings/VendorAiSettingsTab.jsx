import { useState } from 'react';
import { useCloudAi } from '../../context/CloudAiContext';
import { IconPlus, IconClose } from '../../icons';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';

export default function VendorAiSettingsTab() {
  const { aiPlans, globalPlans, setGlobalPlans, vendorSettings, setVendorSettings, vendors, vlmProfiles } = useCloudAi();
  const [showPicker, setShowPicker] = useState(false);
  const [dragOverVendor, setDragOverVendor] = useState(null);

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

  function addSpecificPlan(vendorId, planId) {
    const cur = vendorSettings[vendorId]?.specificPlans || [];
    if (cur.includes(planId)) return;
    setVendorSettings(prev => ({
      ...prev,
      [vendorId]: { ...(prev[vendorId] || {}), specificPlans: [...cur, planId] },
    }));
  }

  function removeSpecificPlan(vendorId, planId) {
    const cur = vendorSettings[vendorId]?.specificPlans || [];
    setVendorSettings(prev => ({
      ...prev,
      [vendorId]: { ...(prev[vendorId] || {}), specificPlans: cur.filter(id => id !== planId) },
    }));
  }

  function onDragStart(e, planId) {
    e.dataTransfer.setData('application/x-plan-id', planId);
    e.dataTransfer.effectAllowed = 'copy';
  }

  function onDragOver(e, vendorId) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dragOverVendor !== vendorId) setDragOverVendor(vendorId);
  }

  function onDragLeave(vendorId) {
    if (dragOverVendor === vendorId) setDragOverVendor(null);
  }

  function onDrop(e, vendorId) {
    e.preventDefault();
    const planId = e.dataTransfer.getData('application/x-plan-id');
    if (planId) addSpecificPlan(vendorId, planId);
    setDragOverVendor(null);
  }

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
        <p className="text-[13px] text-[#999] mb-3">
          從右側「可選的專屬方案」拖曳方案到左側對應 Vendor 列，或點 chip × 移除。
        </p>

        <div className="grid grid-cols-[1fr_280px] gap-5 items-start">
          {/* Left: Vendor list table */}
          <div>
            <table className="w-full border-collapse text-kdc-table">
              <thead>
                <tr>
                  <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-12">項次</th>
                  <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-[180px]">Vendor 名稱</th>
                  <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">專屬方案</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v, i) => {
                  const specs = vendorSettings[v.id]?.specificPlans || [];
                  const isDragOver = dragOverVendor === v.id;
                  return (
                    <tr
                      key={v.id}
                      className={`hover:bg-[#e8f0f8] ${i % 2 === 1 ? 'bg-kdc-table-row-alt' : ''}`}
                    >
                      <td className="px-3 py-2.5 border-b border-kdc-border align-top">{i + 1}</td>
                      <td className="px-3 py-2.5 border-b border-kdc-border align-top">
                        <div className="font-medium">{v.name}</div>
                        <div className="text-[12px] text-[#999]">{v.vid}</div>
                      </td>
                      <td
                        className={`px-3 py-2 border-b border-kdc-border align-top transition-colors ${isDragOver ? 'bg-[#fff3e0] outline-2 outline-dashed outline-[#e65100]' : ''}`}
                        onDragOver={e => onDragOver(e, v.id)}
                        onDragLeave={() => onDragLeave(v.id)}
                        onDrop={e => onDrop(e, v.id)}
                      >
                        {specs.length === 0 ? (
                          <span className="text-[13px] text-[#999]">拖曳方案到此處</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {specs.map(pid => (
                              <span
                                key={pid}
                                className="inline-flex items-center gap-1.5 bg-[#2b2b2b] text-white px-2.5 py-1 rounded-[14px] text-[13px] font-medium"
                              >
                                {planName(pid)}
                                <button
                                  type="button"
                                  aria-label={`移除 ${planName(pid)}`}
                                  className="w-[16px] h-[16px] rounded-full bg-[#4a4a4a] text-white border-none cursor-pointer inline-flex items-center justify-center text-[10px] leading-none hover:bg-[#666] p-0"
                                  onClick={() => removeSpecificPlan(v.id, pid)}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <Pagination total={vendors.length} />
          </div>

          {/* Right: draggable available plans */}
          <aside className="border border-kdc-border rounded-[5px] bg-white sticky top-[100px]">
            <div className="px-3 py-2 border-b border-kdc-border bg-[#fafafa]">
              <p className="text-kdc-body font-medium text-kdc-text">可選的專屬方案</p>
              <p className="text-[11px] text-[#999]">按住方案拖曳到左側 Vendor</p>
            </div>
            {availablePlans.length === 0 ? (
              <p className="px-3 py-6 text-center text-[13px] text-[#999]">
                所有方案已在共用區
              </p>
            ) : (
              <ul className="list-none m-0 p-2 flex flex-col gap-1.5">
                {availablePlans.map(plan => (
                  <li
                    key={plan.id}
                    draggable
                    onDragStart={e => onDragStart(e, plan.id)}
                    className="px-2.5 py-1.5 rounded-[5px] bg-white border border-kdc-border cursor-grab active:cursor-grabbing hover:bg-[#e8f0f8] select-none"
                    title="拖曳到左側 Vendor 的專屬方案欄"
                  >
                    <div className="text-kdc-body font-medium">{plan.name}</div>
                    <div className="text-[11px] text-[#999]">
                      {profileName(plan.vlmProfileId)} · Daily Cap {plan.dailyCap === null ? "∞" : plan.dailyCap}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
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
