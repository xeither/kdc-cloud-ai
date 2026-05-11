import { useState } from 'react';
import { useCloudAi } from '../../context/CloudAiContext';
import { IconPlus, IconEdit, IconTrash } from '../../icons';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import Pagination from '../../components/Pagination';

const PROVIDERS = ["Gemini", "Qwen", "OpenAI", "Claude", "其他"];

const EMPTY_FORM = { name: "", provider: "Gemini", modelVersion: "", description: "" };

export default function VlmProfilesTab() {
  const { vlmProfiles, setVlmProfiles } = useCloudAi();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleting, setDeleting] = useState(null);

  function openNew() {
    setForm({ ...EMPTY_FORM });
    setEditing("new");
  }

  function openEdit(p) {
    setForm({ ...p });
    setEditing(p);
  }

  function closeModal() {
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  function save() {
    if (!form.name.trim() || !form.modelVersion.trim()) return;
    if (editing === "new") {
      setVlmProfiles(prev => [...prev, { ...form, id: "vlm-" + Date.now(), refCount: 0 }]);
    } else {
      setVlmProfiles(prev => prev.map(p => p.id === form.id ? { ...p, ...form } : p));
    }
    closeModal();
  }

  function confirmDelete(p) {
    if (p.refCount > 0) return;
    setDeleting(p);
  }

  function doDelete() {
    setVlmProfiles(prev => prev.filter(p => p.id !== deleting.id));
    setDeleting(null);
  }

  const isFormValid = form.name.trim() && form.modelVersion.trim();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-kdc-body text-kdc-text">共 {vlmProfiles.length} 筆</span>
        <button className="bg-kdc-primary-alt text-white rounded-btn px-3.5 py-1.5 text-sm border border-kdc-border cursor-pointer inline-flex items-center gap-1.5 hover:opacity-85" onClick={openNew}>
          <IconPlus /> 新增 VLM Profile
        </button>
      </div>

      <table className="w-full border-collapse text-kdc-table">
        <thead>
          <tr>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">名稱</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">Provider</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">Model Version</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">說明</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-16">引用數</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-20">功能</th>
          </tr>
        </thead>
        <tbody>
          {vlmProfiles.map((p, i) => (
            <tr key={p.id} className={`hover:bg-[#e8f0f8] ${i % 2 === 1 ? 'bg-kdc-table-row-alt' : ''}`}>
              <td className="px-3 py-2.5 border-b border-kdc-border font-medium">{p.name}</td>
              <td className="px-3 py-2.5 border-b border-kdc-border">
                <span className="inline-block px-2.5 py-0.5 rounded-xl text-[13px] font-medium bg-[#e3f2fd] text-[#1565c0]">{p.provider}</span>
              </td>
              <td className="px-3 py-2.5 border-b border-kdc-border text-[13px] font-mono">{p.modelVersion}</td>
              <td className="px-3 py-2.5 border-b border-kdc-border text-kdc-body">{p.description}</td>
              <td className="px-3 py-2.5 border-b border-kdc-border text-center">
                <span className={`inline-block px-2.5 py-0.5 rounded-xl text-[13px] font-medium ${p.refCount > 0 ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-gray-100 text-gray-500'}`}>
                  {p.refCount}
                </span>
              </td>
              <td className="px-3 py-2.5 border-b border-kdc-border">
                <div className="flex items-center gap-1">
                  <button
                    className="bg-transparent border-none cursor-pointer text-kdc-text p-1 rounded hover:bg-[#e0e7ee] flex items-center"
                    title="編輯"
                    onClick={() => openEdit(p)}
                  >
                    <IconEdit />
                  </button>
                  <button
                    className={`bg-transparent border-none p-1 rounded flex items-center ${p.refCount > 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer text-kdc-text hover:bg-[#e0e7ee]'}`}
                    title={p.refCount > 0 ? "有引用中，無法刪除" : "刪除"}
                    onClick={() => confirmDelete(p)}
                    disabled={p.refCount > 0}
                  >
                    <IconTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination total={vlmProfiles.length} />

      {editing && (
        <Modal
          title={editing === "new" ? "新增 VLM Profile" : "編輯 VLM Profile"}
          onClose={closeModal}
          footer={
            <>
              <button className="px-3.5 py-1.5 text-sm rounded-btn border border-kdc-primary bg-white text-kdc-primary cursor-pointer hover:opacity-85" onClick={closeModal}>取消</button>
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
              名稱 <span className="text-kdc-required">*</span>
            </label>
            <input
              className="h-9 border border-kdc-border rounded-[5px] px-2.5 text-kdc-table font-kdc outline-none w-full focus:border-kdc-primary focus:shadow-[0_0_0_2px_rgba(0,68,128,0.1)]"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="例：gemini_standard"
            />
          </div>

          <div className="mb-4">
            <label className="block text-kdc-body font-medium text-kdc-text mb-1.5">
              Provider <span className="text-kdc-required">*</span>
            </label>
            <select
              className="h-9 border border-kdc-border rounded-[5px] px-2 text-kdc-table font-kdc bg-white outline-none cursor-pointer w-full focus:border-kdc-primary"
              value={form.provider}
              onChange={e => setForm(f => ({ ...f, provider: e.target.value }))}
            >
              {PROVIDERS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-kdc-body font-medium text-kdc-text mb-1.5">
              Model Version <span className="text-kdc-required">*</span>
            </label>
            <input
              className="h-9 border border-kdc-border rounded-[5px] px-2.5 text-kdc-table font-kdc outline-none w-full focus:border-kdc-primary focus:shadow-[0_0_0_2px_rgba(0,68,128,0.1)]"
              value={form.modelVersion}
              onChange={e => setForm(f => ({ ...f, modelVersion: e.target.value }))}
              placeholder="例：gemini-3.1-flash-lite_preview"
            />
          </div>

          <div className="mb-4">
            <label className="block text-kdc-body font-medium text-kdc-text mb-1.5">說明</label>
            <textarea
              className="border border-kdc-border rounded-[5px] px-2.5 py-2 text-kdc-body font-kdc outline-none w-full resize-y min-h-[80px] focus:border-kdc-primary focus:shadow-[0_0_0_2px_rgba(0,68,128,0.1)]"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="此 VLM Profile 的用途說明"
            />
          </div>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          message={`確定要刪除「${deleting.name}」嗎？此操作無法復原。`}
          onConfirm={doDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
