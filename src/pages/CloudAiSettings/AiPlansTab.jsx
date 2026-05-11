import { useState } from 'react';
import { useCloudAi } from '../../context/CloudAiContext';
import { IconPlus, IconEdit, IconTrash } from '../../icons';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import Pagination from '../../components/Pagination';

const EMPTY_FORM = {
  id: null,
  name: "",
  vlmProfileId: "",
  dailyCap: "",
  description: "",
  prompts: [],          // Prompt IDs (references — Prompt 編輯會即時反映到所有引用的 AI Plan)
  defaultPromptId: null,
};

export default function AiPlansTab() {
  const { aiPlans, setAiPlans, vlmProfiles, prompts, globalPlans, vendorSettings, vendors } = useCloudAi();
  const [editing, setEditing] = useState(null); // "new" | plan object | null
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleting, setDeleting] = useState(null);
  const [blockedDelete, setBlockedDelete] = useState(null);
  const [blockedRemoveDefault, setBlockedRemoveDefault] = useState(false);

  function profileName(id) {
    return vlmProfiles.find(p => p.id === id)?.name || "—";
  }

  function promptName(id) {
    return prompts.find(p => p.id === id)?.name || "（已刪除）";
  }

  function usedByVendorCount(planId) {
    if (globalPlans.includes(planId)) return vendors.length;
    return vendors.filter(v => (vendorSettings[v.id]?.specificPlans || []).includes(planId)).length;
  }

  function openNew() {
    const defaultPrompt = prompts.find(p => p.name === "中文場景描述");
    setForm({
      ...EMPTY_FORM,
      vlmProfileId: vlmProfiles[0]?.id || "",
      prompts: defaultPrompt ? [defaultPrompt.id] : [],
      defaultPromptId: defaultPrompt?.id || null,
    });
    setEditing("new");
  }

  function openEdit(plan) {
    setForm({
      id: plan.id,
      name: plan.name,
      vlmProfileId: plan.vlmProfileId,
      dailyCap: plan.dailyCap === null ? "" : String(plan.dailyCap),
      description: plan.description || "",
      prompts: [...(plan.prompts || [])],
      defaultPromptId: plan.defaultPromptId,
    });
    setEditing(plan);
  }

  function closeModal() {
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  function togglePrompt(promptId, checked) {
    if (!checked) {
      // 取消勾選預設 prompt 視為「刪除預設」→ 套用 D-029 硬阻擋
      if (promptId === form.defaultPromptId) {
        setBlockedRemoveDefault(true);
        return;
      }
      setForm(f => ({ ...f, prompts: f.prompts.filter(id => id !== promptId) }));
    } else {
      setForm(f => {
        const nextPrompts = f.prompts.includes(promptId) ? f.prompts : [...f.prompts, promptId];
        // 若原本沒有預設（第一次勾選時），自動把這個設為預設
        const nextDefault = f.defaultPromptId || promptId;
        return { ...f, prompts: nextPrompts, defaultPromptId: nextDefault };
      });
    }
  }

  function setDefault(promptId) {
    // 只允許把預設切到已勾選的 prompt
    setForm(f => {
      if (!f.prompts.includes(promptId)) return f;
      return { ...f, defaultPromptId: promptId };
    });
  }

  function save() {
    if (!form.name.trim()) return;
    if (form.prompts.length === 0) return;
    if (!form.defaultPromptId || !form.prompts.includes(form.defaultPromptId)) return;
    const dailyCap = form.dailyCap === "" || form.dailyCap === null ? null : Number(form.dailyCap);
    const payload = {
      name: form.name.trim(),
      vlmProfileId: form.vlmProfileId,
      dailyCap,
      description: form.description,
      prompts: form.prompts,
      defaultPromptId: form.defaultPromptId,
    };
    if (editing === "new") {
      setAiPlans(prev => [...prev, { id: "plan-" + Date.now(), ...payload }]);
    } else {
      setAiPlans(prev => prev.map(p => p.id === form.id ? { ...p, ...payload } : p));
    }
    closeModal();
  }

  function tryDelete(plan) {
    if (usedByVendorCount(plan.id) > 0) {
      setBlockedDelete(plan);
    } else {
      setDeleting(plan);
    }
  }

  const isFormValid =
    form.name.trim() &&
    form.prompts.length > 0 &&
    !!form.defaultPromptId &&
    form.prompts.includes(form.defaultPromptId);

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
                  {(plan.prompts || []).map(pid => {
                    const isDefault = pid === plan.defaultPromptId;
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
                        {promptName(pid)}
                      </span>
                    );
                  })}
                </div>
              </td>
              <td className="px-3 py-2.5 border-b border-kdc-border text-kdc-body">{plan.description}</td>
              <td className="px-3 py-2.5 border-b border-kdc-border text-center">{usedByVendorCount(plan.id)}</td>
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
          ))}
        </tbody>
      </table>

      <Pagination total={aiPlans.length} />

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
              {vlmProfiles.map(p => (
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
              <span className="text-[#999] text-xs font-normal ml-1">（勾選此方案使用的 Prompt；恰一個為預設。Prompt 內容請至「Prompts」分頁編輯）</span>
            </label>
            <div className="border border-kdc-border rounded-[5px] max-h-[260px] overflow-y-auto bg-white">
              {prompts.length === 0 ? (
                <div className="px-3 py-6 text-center text-[#999] text-[13px]">
                  尚無 Prompt — 請先到「Prompts」分頁建立
                </div>
              ) : (
                prompts.map(p => {
                  const checked = form.prompts.includes(p.id);
                  const isDefault = p.id === form.defaultPromptId;
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center px-3 py-2 border-b last:border-b-0 border-kdc-border ${checked ? 'bg-[#f0f7ff]' : ''}`}
                    >
                      <label className="flex items-center flex-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={e => togglePrompt(p.id, e.target.checked)}
                          className="mr-2.5 w-[18px] h-[18px] cursor-pointer"
                        />
                        <span className="flex-1">
                          <span className="text-kdc-body font-medium">{p.name}</span>
                          {(p.tags || []).length > 0 && (
                            <span className="text-[#999] text-xs ml-2">({(p.tags || []).join(", ")})</span>
                          )}
                        </span>
                      </label>
                      <label
                        className={`inline-flex items-center gap-1 text-[12px] px-2 py-0.5 rounded ml-2 ${
                          checked ? 'cursor-pointer hover:bg-[#e0e7ee] text-kdc-text' : 'cursor-not-allowed text-[#999]'
                        }`}
                        title={checked ? "設為預設" : "請先勾選此 Prompt 才能設為預設"}
                      >
                        <input
                          type="radio"
                          name="ai-plan-default-prompt"
                          checked={isDefault}
                          disabled={!checked}
                          onChange={() => setDefault(p.id)}
                          className={checked ? 'cursor-pointer' : 'cursor-not-allowed'}
                        />
                        <span>預設</span>
                      </label>
                    </div>
                  );
                })
              )}
            </div>
            <p className="text-xs text-[#999] mt-1">
              已勾選 {form.prompts.length} 個 Prompt
              {form.defaultPromptId && form.prompts.includes(form.defaultPromptId) && (
                <span>（預設：<span className="text-[#2e7d32] font-medium">{promptName(form.defaultPromptId)}</span>）</span>
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
          message={`「${blockedDelete.name}」目前有 ${usedByVendorCount(blockedDelete.id)} 個 Vendor 使用中，請先到「Vendor AI 設定」將此方案移除後再刪除。`}
          confirmText="我知道了"
          variant="warning"
          singleButton
          onConfirm={() => setBlockedDelete(null)}
          onCancel={() => setBlockedDelete(null)}
        />
      )}

      {blockedRemoveDefault && (
        <ConfirmDialog
          title="無法取消預設 Prompt"
          message="預設 Prompt 不可直接取消勾選，請先將其他 Prompt 設為預設後再取消。"
          confirmText="我知道了"
          variant="warning"
          singleButton
          onConfirm={() => setBlockedRemoveDefault(false)}
          onCancel={() => setBlockedRemoveDefault(false)}
        />
      )}
    </div>
  );
}
