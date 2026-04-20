import { useState } from 'react';
import { useCloudAi } from '../../context/CloudAiContext';
import { IconPlus, IconEdit, IconTrash, IconArrowUp, IconArrowDown } from '../../icons';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import Pagination from '../../components/Pagination';

const EMPTY_FORM = { name: "", vlmProfileId: "", dailyCap: "", prompts: [], description: "" };

export default function AiPlansTab() {
  const { aiPlans, setAiPlans, vlmProfiles, prompts } = useCloudAi();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleting, setDeleting] = useState(null);

  function profileName(id) {
    return vlmProfiles.find(p => p.id === id)?.name || "—";
  }

  function promptName(id) {
    return prompts.find(p => p.id === id)?.name || id;
  }

  function openNew() {
    setForm({ ...EMPTY_FORM, prompts: [], vlmProfileId: vlmProfiles[0]?.id || "" });
    setEditing("new");
  }

  function openEdit(plan) {
    setForm({ ...plan, prompts: [...plan.prompts], dailyCap: plan.dailyCap === null ? "" : plan.dailyCap });
    setEditing(plan);
  }

  function closeModal() {
    setEditing(null);
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

  function save() {
    if (!form.name.trim()) return;
    const dailyCap = form.dailyCap === "" || form.dailyCap === null ? null : Number(form.dailyCap);
    if (editing === "new") {
      setAiPlans(prev => [...prev, {
        ...form,
        dailyCap,
        id: "plan-" + Date.now(),
        boundUdidCount: 0,
        vendorCount: 0,
      }]);
    } else {
      setAiPlans(prev => prev.map(p => p.id === form.id ? { ...p, ...form, dailyCap } : p));
    }
    closeModal();
  }

  const isFormValid = form.name.trim();

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
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-16">UDID</th>
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
                  {(plan.prompts || []).map(pid => (
                    <span key={pid} className="inline-flex items-center gap-1 bg-[#e8f0f8] text-kdc-primary px-2.5 py-0.5 rounded-xl text-[13px] mr-1 mb-0.5">
                      {promptName(pid)}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-3 py-2.5 border-b border-kdc-border text-kdc-body">{plan.description}</td>
              <td className="px-3 py-2.5 border-b border-kdc-border text-center">{plan.boundUdidCount}</td>
              <td className="px-3 py-2.5 border-b border-kdc-border text-center">{plan.vendorCount}</td>
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
                    onClick={() => setDeleting(plan)}
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
            <label className="block text-kdc-body font-medium text-kdc-text mb-1.5">Prompts</label>
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
    </div>
  );
}
