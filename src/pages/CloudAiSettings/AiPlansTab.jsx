import { useState } from 'react';
import { useCloudAi } from '../../context/CloudAiContext';
import { IconPlus, IconEdit, IconTrash, IconArrowUp, IconArrowDown } from '../../icons';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import Pagination from '../../components/Pagination';

const EMPTY_FORM = {
  id: null,
  name: "",
  vlmProfileId: "",
  dailyCap: "",
  description: "",
  prompts: [],          // Prompt IDs (ordered; prompts[0] 即為預設)
};

export default function AiPlansTab({ region, env }) {
  const { aiPlans, setAiPlans, vlmProfiles, prompts, globalPlans, customers, customerCloudAi } = useCloudAi();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleting, setDeleting] = useState(null);
  const [blockedDelete, setBlockedDelete] = useState(null);

  // 當前 (region, env) 下可用的 plans / profiles / prompts
  const scopedPlans = aiPlans.filter(p => p.region === region && p.env === env);
  const scopedProfiles = vlmProfiles.filter(p => p.region === region && p.env === env);
  const scopedPrompts = prompts.filter(p => p.region === region && p.env === env);

  function profileName(id) {
    return vlmProfiles.find(p => p.id === id)?.name || "—";
  }

  function getPrompt(id) {
    return prompts.find(p => p.id === id);
  }

  // 顯示用：優先用 description（給 PM 更直觀的辨識），無則 fallback 到 name
  function promptLabel(id) {
    const p = getPrompt(id);
    if (!p) return "（已刪除）";
    return (p.description && p.description.trim()) || p.name;
  }

  function usedByCustomerCount(planId) {
    // 全域方案：所有客戶都套用
    if (globalPlans.includes(planId)) return customers.length;
    // 專屬方案：看 customerCloudAi[*].selectedSpecificPlanIds 包含此 planId 的客戶數
    return customers.filter(c => {
      const ids = customerCloudAi[c.id]?.selectedSpecificPlanIds || [];
      return ids.includes(planId);
    }).length;
  }

  function openNew() {
    // 預設挑當前 scope 下的第一個 VLM Profile + 該 scope 下名稱類似「中文場景描述」的 prompt（無則挑第一個）
    const defaultPrompt = scopedPrompts.find(p => p.name.startsWith("中文場景描述")) || scopedPrompts[0];
    setForm({
      ...EMPTY_FORM,
      vlmProfileId: scopedProfiles[0]?.id || "",
      prompts: defaultPrompt ? [defaultPrompt.id] : [],
    });
    setEditing("new");
  }

  function openEdit(plan) {
    // 防呆：若 plan.prompts 含已被刪除的 prompt id（legacy state），開 modal 時先過濾
    const validPromptIds = (plan.prompts || []).filter(pid => prompts.some(p => p.id === pid));
    setForm({
      id: plan.id,
      name: plan.name,
      vlmProfileId: plan.vlmProfileId,
      dailyCap: plan.dailyCap === null ? "" : String(plan.dailyCap),
      description: plan.description || "",
      prompts: validPromptIds,
    });
    setEditing(plan);
  }

  function closeModal() {
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  function togglePrompt(promptId, checked) {
    setForm(f => {
      if (checked) {
        if (f.prompts.includes(promptId)) return f;
        return { ...f, prompts: [...f.prompts, promptId] };
      } else {
        // 取消勾選：直接移除（若為預設，下一個自動接管，因為 prompts[0] 即預設）
        return { ...f, prompts: f.prompts.filter(id => id !== promptId) };
      }
    });
  }

  function movePrompt(promptId, direction) {
    setForm(f => {
      const idx = f.prompts.indexOf(promptId);
      if (idx < 0) return f;
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= f.prompts.length) return f;
      const next = [...f.prompts];
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...f, prompts: next };
    });
  }

  function save() {
    if (!form.name.trim()) return;
    if (form.prompts.length === 0) return;
    const dailyCap = form.dailyCap === "" || form.dailyCap === null ? null : Number(form.dailyCap);
    const payload = {
      name: form.name.trim(),
      vlmProfileId: form.vlmProfileId,
      dailyCap,
      description: form.description,
      prompts: form.prompts,
    };
    if (editing === "new") {
      // 新建 plan 自動歸屬當前 (region, env)
      setAiPlans(prev => [...prev, { id: "plan-" + Date.now(), ...payload, region, env }]);
    } else {
      setAiPlans(prev => prev.map(p => p.id === form.id ? { ...p, ...payload } : p));
    }
    closeModal();
  }

  function tryDelete(plan) {
    if (usedByCustomerCount(plan.id) > 0) {
      setBlockedDelete(plan);
    } else {
      setDeleting(plan);
    }
  }

  const isFormValid = form.name.trim() && form.prompts.length > 0;

  // Modal 內 prompt 排序：先呈現已勾選（依方案內順序），再列未勾選（依 Prompt tab 順序）。
  // 只列出當前 (region, env) 下的 prompts — AI Plan 不能跨 scope 引用。
  const selectedSet = new Set(form.prompts);
  const orderedPromptsForModal = [
    ...form.prompts.map(id => getPrompt(id)).filter(Boolean),
    ...scopedPrompts.filter(p => !selectedSet.has(p.id)),
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-kdc-body text-kdc-text">共 {scopedPlans.length} 筆（{region} / {env}）</span>
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
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">方案名稱</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">VLM Profile</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-24">Daily Cap</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">Prompts</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">說明</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-16">客戶</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-20">功能</th>
          </tr>
        </thead>
        <tbody>
          {scopedPlans.map((plan, i) => {
            const defaultId = plan.prompts?.[0];
            return (
              <tr key={plan.id} className={`hover:bg-[#e8f0f8] ${i % 2 === 1 ? 'bg-kdc-table-row-alt' : ''}`}>
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
                    {(plan.prompts || []).map(pid => {
                      const isDefault = pid === defaultId;
                      return (
                        <span
                          key={pid}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[13px] mr-1 mb-0.5 ${
                            isDefault
                              ? 'bg-[#e8f5e9] text-[#2e7d32]'
                              : 'bg-[#e8f0f8] text-kdc-primary'
                          }`}
                          title={isDefault ? "預設 prompt" : undefined}
                        >
                          {isDefault && <span aria-hidden>★</span>}
                          {promptLabel(pid)}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-3 py-2.5 border-b border-kdc-border text-kdc-body">{plan.description}</td>
                <td className="px-3 py-2.5 border-b border-kdc-border text-center">{usedByCustomerCount(plan.id)}</td>
                <td className="px-3 py-2.5 border-b border-kdc-border">
                  <div className="flex items-center gap-1">
                    <button
                      className="bg-transparent border-none cursor-pointer text-kdc-text p-1 rounded hover:bg-[#e0e7ee] flex items-center"
                      title="編輯"
                      onClick={() => openEdit(plan)}
                    >
                      <IconEdit />
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
            );
          })}
        </tbody>
      </table>

      <Pagination total={scopedPlans.length} />

      {editing && (
        <Modal
          title={editing === "new" ? "新增方案" : "編輯方案"}
          onClose={closeModal}
          footer={
            <>
              <button
                className="px-3.5 py-1.5 text-sm rounded-btn border border-kdc-primary bg-white text-kdc-primary cursor-pointer hover:opacity-85"
                onClick={closeModal}
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
              {scopedProfiles.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-kdc-body font-medium text-kdc-text mb-1.5">
              Daily Cap <span className="text-[#999] text-xs font-normal">（留空 = 無限制）</span>
            </label>
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
              <span className="text-[#999] text-xs font-normal ml-1">（勾選此方案使用的 Prompt；第一個為預設，可用 ↑↓ 調整順序。Prompt 內容請至「Prompts」分頁編輯）</span>
            </label>
            <div className="border border-kdc-border rounded-[5px] max-h-[300px] overflow-y-auto bg-white">
              {scopedPrompts.length === 0 ? (
                <div className="px-3 py-6 text-center text-[#999] text-[13px]">
                  此 ({region} / {env}) 尚無 Prompt — 請先到「Prompts」分頁切到同 scope 建立
                </div>
              ) : (
                orderedPromptsForModal.map(p => {
                  const checked = selectedSet.has(p.id);
                  const idx = checked ? form.prompts.indexOf(p.id) : -1;
                  const isDefault = checked && idx === 0;
                  const canUp = checked && idx > 0;
                  const canDown = checked && idx >= 0 && idx < form.prompts.length - 1;
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center px-3 py-2 border-b last:border-b-0 border-kdc-border ${checked ? 'bg-[#f0f7ff]' : ''}`}
                    >
                      <div className="flex items-center gap-0.5 mr-2">
                        <button
                          type="button"
                          className={`p-1 rounded flex items-center ${canUp ? 'cursor-pointer hover:bg-[#e0e7ee] text-kdc-text' : 'opacity-25 cursor-not-allowed text-kdc-text'}`}
                          title={canUp ? "上移" : "無法上移"}
                          onClick={() => canUp && movePrompt(p.id, "up")}
                          disabled={!canUp}
                        >
                          <IconArrowUp />
                        </button>
                        <button
                          type="button"
                          className={`p-1 rounded flex items-center ${canDown ? 'cursor-pointer hover:bg-[#e0e7ee] text-kdc-text' : 'opacity-25 cursor-not-allowed text-kdc-text'}`}
                          title={canDown ? "下移" : "無法下移"}
                          onClick={() => canDown && movePrompt(p.id, "down")}
                          disabled={!canDown}
                        >
                          <IconArrowDown />
                        </button>
                      </div>
                      <label className="flex items-center flex-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={e => togglePrompt(p.id, e.target.checked)}
                          className="mr-2.5 w-[18px] h-[18px] cursor-pointer"
                        />
                        <span className="flex-1 flex items-center gap-2">
                          <span className="text-kdc-body font-medium">
                            {(p.description && p.description.trim()) || p.name}
                          </span>
                          {isDefault && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-xl text-[11px] font-medium whitespace-nowrap bg-[#e8f5e9] text-[#2e7d32]">
                              ★ 預設
                            </span>
                          )}
                        </span>
                      </label>
                    </div>
                  );
                })
              )}
            </div>
            <p className="text-xs text-[#999] mt-1">
              已勾選 {form.prompts.length} 個 Prompt
              {form.prompts.length > 0 && (
                <span>（預設：<span className="text-[#2e7d32] font-medium">{promptLabel(form.prompts[0])}</span>）</span>
              )}
            </p>
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
          message={`「${blockedDelete.name}」目前有 ${usedByCustomerCount(blockedDelete.id)} 個客戶使用中，請先到「客戶資訊」頁面該客戶的「Cloud AI」tab 將此方案移除後再刪除。`}
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
