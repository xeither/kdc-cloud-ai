import { useState } from 'react';
import { useCloudAi } from '../../context/CloudAiContext';
import { IconPlus, IconView, IconTrash, IconArrowUp, IconArrowDown, IconChevronDown, IconChevronRight } from '../../icons';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import Pagination from '../../components/Pagination';

const EMPTY_FORM = { name: "", vlmProfileId: "", dailyCap: "", prompts: [], description: "" };

export default function AiPlansTab() {
  const { aiPlans, setAiPlans, vlmProfiles, prompts, globalPlans, vendorSettings, vendors } = useCloudAi();
  const [creating, setCreating] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleting, setDeleting] = useState(null);
  const [blockedDelete, setBlockedDelete] = useState(null);

  function profileName(id) {
    return vlmProfiles.find(p => p.id === id)?.name || "—";
  }

  // 動態計算使用此 Plan 的 Vendor 數：在 globalPlans → 所有 vendors；否則數 specificPlans 命中
  function usedByVendorCount(planId) {
    if (globalPlans.includes(planId)) return vendors.length;
    return vendors.filter(v => (vendorSettings[v.id]?.specificPlans || []).includes(planId)).length;
  }

  function openNew() {
    const defaultPrompt = prompts.find(p => p.name === "中文場景描述");
    setForm({ ...EMPTY_FORM, prompts: defaultPrompt ? [defaultPrompt.id] : [], vlmProfileId: vlmProfiles[0]?.id || "" });
    setCreating(true);
  }

  function closeCreate() {
    setCreating(false);
    setForm(EMPTY_FORM);
  }

  function togglePrompt(pid) {
    setForm(f => {
      const arr = f.prompts || [];
      if (arr.includes(pid)) {
        return { ...f, prompts: arr.filter(id => id !== pid) };
      } else {
        return { ...f, prompts: [...arr, pid] };
      }
    });
  }

  function movePrompt(idx, dir) {
    setForm(f => {
      const arr = [...(f.prompts || [])];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= arr.length) return f;
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return { ...f, prompts: arr };
    });
  }

  // 儲存時深拷貝選到的 Prompt 當下內容，之後 Prompt 被編輯不影響此 Plan
  function save() {
    if (!form.name.trim() || (form.prompts || []).length === 0) return;
    const dailyCap = form.dailyCap === "" || form.dailyCap === null ? null : Number(form.dailyCap);
    const now = new Date().toISOString().slice(0, 10);
    const promptSnapshots = (form.prompts || []).map(pid => {
      const p = prompts.find(x => x.id === pid);
      return { id: p.id, name: p.name, promptBody: p.promptBody, snapshotAt: now };
    });
    setAiPlans(prev => [...prev, {
      id: "plan-" + Date.now(),
      name: form.name,
      vlmProfileId: form.vlmProfileId,
      dailyCap,
      description: form.description,
      prompts: promptSnapshots,
    }]);
    closeCreate();
  }

  function tryDelete(plan) {
    if (usedByVendorCount(plan.id) > 0) {
      setBlockedDelete(plan);
    } else {
      setDeleting(plan);
    }
  }

  const isFormValid = form.name.trim() && (form.prompts || []).length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-kdc-body text-kdc-text">共 {aiPlans.length} 筆</span>
        <button
          className="bg-kdc-primary-alt text-white rounded-btn px-3.5 py-1.5 text-sm border border-kdc-border cursor-pointer inline-flex items-center gap-1.5 hover:opacity-85"
          onClick={openNew}
        >
          <IconPlus /> 新增方案
        </button>
      </div>

      <table className="w-full border-collapse text-kdc-table">
        <thead>
          <tr>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-12">項次</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">方案名稱</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">VLM Profile</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-24">Daily Cap</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">Prompts</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">說明</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-16">Vendors</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-20">功能</th>
          </tr>
        </thead>
        <tbody>
          {aiPlans.map((plan, i) => (
            <tr key={plan.id} className={`hover:bg-[#e8f0f8] ${i % 2 === 1 ? 'bg-kdc-table-row-alt' : ''}`}>
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
                <div className="flex flex-wrap">
                  {(plan.prompts || []).map(snap => (
                    <span key={snap.id} className="inline-flex items-center gap-1 bg-[#e8f0f8] text-kdc-primary px-2.5 py-0.5 rounded-xl text-[13px] mr-1 mb-0.5">
                      {snap.name}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-3 py-2.5 border-b border-kdc-border text-kdc-body">{plan.description}</td>
              <td className="px-3 py-2.5 border-b border-kdc-border text-center">{usedByVendorCount(plan.id)}</td>
              <td className="px-3 py-2.5 border-b border-kdc-border">
                <div className="flex items-center gap-1">
                  <button
                    className="bg-transparent border-none cursor-pointer text-kdc-text p-1 rounded hover:bg-[#e0e7ee] flex items-center"
                    title="檢視"
                    onClick={() => setViewing(plan)}
                  >
                    <IconView />
                  </button>
                  <button
                    className="bg-transparent border-none cursor-pointer text-kdc-text p-1 rounded hover:bg-[#e0e7ee] flex items-center"
                    title="刪除"
                    onClick={() => tryDelete(plan)}
                  >
                    <IconTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination total={aiPlans.length} />

      {creating && (
        <Modal
          title="新增方案"
          onClose={closeCreate}
          footer={
            <>
              <button
                className="px-3.5 py-1.5 text-sm rounded-btn border border-kdc-primary bg-white text-kdc-primary cursor-pointer hover:opacity-85"
                onClick={closeCreate}
              >
                取消
              </button>
              <button
                className="px-3.5 py-1.5 text-sm rounded-btn border border-kdc-border bg-kdc-primary-alt text-white cursor-pointer hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={save}
                disabled={!isFormValid}
              >
                儲存
              </button>
            </>
          }
        >
          <div className="mb-4">
            <label className="block text-kdc-body font-medium text-kdc-text mb-1.5">
              方案名稱 <span className="text-kdc-required">*</span>
            </label>
            <input
              className="h-9 border border-kdc-border rounded-[5px] px-2.5 text-kdc-table font-kdc outline-none w-full focus:border-kdc-primary focus:shadow-[0_0_0_2px_rgba(0,68,128,0.1)]"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="例：看圖說故事"
            />
          </div>

          <div className="mb-4">
            <label className="block text-kdc-body font-medium text-kdc-text mb-1.5">VLM Profile</label>
            <select
              className="h-9 border border-kdc-border rounded-[5px] px-2 text-kdc-table font-kdc bg-white outline-none cursor-pointer w-full focus:border-kdc-primary"
              value={form.vlmProfileId}
              onChange={e => setForm(f => ({ ...f, vlmProfileId: e.target.value }))}
            >
              {vlmProfiles.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-kdc-body font-medium text-kdc-text mb-1.5">Daily Cap <span className="text-[#999] text-xs font-normal">（留空 = 無限制）</span></label>
            <input
              type="number"
              min={0}
              className="h-9 border border-kdc-border rounded-[5px] px-2.5 text-kdc-table font-kdc outline-none w-full focus:border-kdc-primary focus:shadow-[0_0_0_2px_rgba(0,68,128,0.1)]"
              value={form.dailyCap}
              onChange={e => setForm(f => ({ ...f, dailyCap: e.target.value }))}
              placeholder="留空表示無限制 (∞)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-kdc-body font-medium text-kdc-text mb-1.5">
              Prompts <span className="text-kdc-required">*</span>
              <span className="text-[#999] text-xs font-normal ml-1">（儲存時會快照當下內容，之後 Prompt 編輯不影響此方案）</span>
            </label>
            <div className="border border-kdc-border rounded-[5px] max-h-[200px] overflow-y-auto">
              {prompts.map(p => {
                const checked = (form.prompts || []).includes(p.id);
                const idx = (form.prompts || []).indexOf(p.id);
                return (
                  <div key={p.id} className={`flex items-center px-3 py-1.5 border-b border-kdc-border ${checked ? 'bg-[#f0f7ff]' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePrompt(p.id)}
                      className="mr-2.5 w-[18px] h-[18px]"
                    />
                    <span className="flex-1 text-kdc-body">
                      {p.name}{' '}
                      <span className="text-[#999] text-xs">({(p.tags || []).join(", ")})</span>
                    </span>
                    {checked && (
                      <span className="flex gap-1">
                        <button
                          className="bg-transparent border-none p-0.5 cursor-pointer disabled:opacity-30"
                          onClick={() => movePrompt(idx, -1)}
                          disabled={idx === 0}
                        >
                          <IconArrowUp />
                        </button>
                        <button
                          className="bg-transparent border-none p-0.5 cursor-pointer disabled:opacity-30"
                          onClick={() => movePrompt(idx, 1)}
                          disabled={idx === (form.prompts || []).length - 1}
                        >
                          <IconArrowDown />
                        </button>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-[#999] mt-1">已選 {(form.prompts || []).length} 個 Prompt</p>
          </div>

          <div className="mb-4">
            <label className="block text-kdc-body font-medium text-kdc-text mb-1.5">說明</label>
            <textarea
              className="border border-kdc-border rounded-[5px] px-2.5 py-2 text-kdc-body font-kdc outline-none w-full resize-y min-h-[80px] focus:border-kdc-primary focus:shadow-[0_0_0_2px_rgba(0,68,128,0.1)]"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="此方案的用途說明"
            />
          </div>
        </Modal>
      )}

      {viewing && (
        <PlanViewDialog plan={viewing} profileName={profileName} onClose={() => setViewing(null)} />
      )}

      {deleting && (
        <ConfirmDialog
          message={`確定要刪除「${deleting.name}」嗎？此操作無法復原。`}
          onConfirm={() => {
            setAiPlans(prev => prev.filter(p => p.id !== deleting.id));
            setDeleting(null);
          }}
          onCancel={() => setDeleting(null)}
        />
      )}

      {blockedDelete && (
        <ConfirmDialog
          title="無法刪除"
          message={`「${blockedDelete.name}」目前有 ${usedByVendorCount(blockedDelete.id)} 個 Vendor 使用中，請先到「Vendor AI 設定」將此方案移除後再刪除。`}
          confirmText="我知道了"
          variant="warning"
          singleButton
          onConfirm={() => setBlockedDelete(null)}
          onCancel={() => setBlockedDelete(null)}
        />
      )}
    </div>
  );
}

function PlanViewDialog({ plan, profileName, onClose }) {
  const [expanded, setExpanded] = useState({});

  function toggle(id) {
    setExpanded(e => ({ ...e, [id]: !e[id] }));
  }

  return (
    <Modal
      title="檢視方案"
      onClose={onClose}
      footer={
        <button
          className="px-3.5 py-1.5 text-sm rounded-btn border border-kdc-primary bg-white text-kdc-primary cursor-pointer hover:opacity-85"
          onClick={onClose}
        >
          關閉
        </button>
      }
    >
      <div className="mb-3">
        <div className="text-kdc-body font-medium text-[#999] mb-1">方案名稱</div>
        <div className="text-kdc-table font-medium">{plan.name}</div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <div className="text-kdc-body font-medium text-[#999] mb-1">VLM Profile</div>
          <span className="inline-block px-2.5 py-0.5 rounded-xl text-[13px] font-medium bg-[#e8f5e9] text-[#2e7d32]">
            {profileName(plan.vlmProfileId)}
          </span>
        </div>
        <div>
          <div className="text-kdc-body font-medium text-[#999] mb-1">Daily Cap</div>
          <div className="text-kdc-table">{plan.dailyCap === null ? "∞" : plan.dailyCap}</div>
        </div>
      </div>
      {plan.description && (
        <div className="mb-4">
          <div className="text-kdc-body font-medium text-[#999] mb-1">說明</div>
          <div className="text-kdc-body">{plan.description}</div>
        </div>
      )}
      <div>
        <div className="text-kdc-body font-medium text-[#999] mb-2">
          Prompts（快照，共 {(plan.prompts || []).length} 個）
        </div>
        <div className="border border-kdc-border rounded-[5px] overflow-hidden">
          {(plan.prompts || []).map((snap, i) => {
            const isOpen = !!expanded[snap.id];
            return (
              <div key={snap.id} className={i > 0 ? "border-t border-kdc-border" : ""}>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 bg-transparent border-none cursor-pointer hover:bg-[#f0f7ff] text-left"
                  onClick={() => toggle(snap.id)}
                >
                  {isOpen ? <IconChevronDown /> : <IconChevronRight />}
                  <span className="flex-1 text-kdc-body font-medium">{snap.name}</span>
                  {snap.snapshotAt && (
                    <span className="text-[11px] text-[#999]">快照於 {snap.snapshotAt}</span>
                  )}
                </button>
                {isOpen && (
                  <pre className="m-0 px-3 py-2 bg-[#f8f9fa] text-[12px] font-mono whitespace-pre-wrap border-t border-kdc-border">
                    {snap.promptBody}
                  </pre>
                )}
              </div>
            );
          })}
          {(plan.prompts || []).length === 0 && (
            <div className="px-3 py-6 text-center text-[#999] text-kdc-body">無 Prompt</div>
          )}
        </div>
      </div>
    </Modal>
  );
}
