import { useState } from 'react';
import { useCloudAi } from '../../context/CloudAiContext';
import { IconPlus, IconEdit, IconCopy, IconTrash } from '../../icons';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import Pagination from '../../components/Pagination';

const today = new Date().toISOString().slice(0, 10);

const EMPTY_FORM = { name: "", description: "", tags: [], promptBody: '{\n  \n}' };

export default function PromptsTab() {
  const { prompts, setPrompts } = useCloudAi();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleting, setDeleting] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [dupName, setDupName] = useState(null);

  function openNew() {
    setForm({ ...EMPTY_FORM, tags: [] });
    setTagInput("");
    setEditing("new");
  }

  function openEdit(p) {
    setForm({ ...p, tags: [...p.tags] });
    setTagInput("");
    setEditing(p);
  }

  function closeModal() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setTagInput("");
  }

  function uniqueCopyName(base) {
    const existing = new Set(prompts.map(p => p.name));
    let candidate = `${base} (副本)`;
    let n = 2;
    while (existing.has(candidate)) {
      candidate = `${base} (副本 ${n})`;
      n++;
    }
    return candidate;
  }

  function doCopy(p) {
    const copy = { ...p, id: "p-" + Date.now(), name: uniqueCopyName(p.name), updatedAt: today, tags: [...p.tags] };
    setPrompts(prev => [...prev, copy]);
  }

  function isDuplicateName(name) {
    const trimmed = name.trim();
    return prompts.some(p => p.name === trimmed && p.id !== form.id);
  }

  function addTag(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !form.tags.includes(tag)) {
        setForm(f => ({ ...f, tags: [...f.tags, tag] }));
      }
      setTagInput("");
    }
  }

  function removeTag(tag) {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  }

  function save() {
    const trimmed = form.name.trim();
    if (!trimmed) return;
    if (isDuplicateName(trimmed)) {
      setDupName(trimmed);
      return;
    }
    if (editing === "new") {
      setPrompts(prev => [...prev, { ...form, name: trimmed, id: "p-" + Date.now(), updatedAt: today }]);
    } else {
      setPrompts(prev => prev.map(p => p.id === form.id ? { ...p, ...form, name: trimmed, updatedAt: today } : p));
    }
    closeModal();
  }

  const isFormValid = form.name.trim();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-kdc-body text-kdc-text">共 {prompts.length} 筆</span>
        <button className="bg-kdc-primary-alt text-white rounded-btn px-3.5 py-1.5 text-sm border border-kdc-border cursor-pointer inline-flex items-center gap-1.5 hover:opacity-85" onClick={openNew}>
          <IconPlus /> 新增 Prompt
        </button>
      </div>

      <table className="w-full border-collapse text-kdc-table">
        <thead>
          <tr>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-12">項次</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">名稱</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">說明</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">標籤</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-28">更新日期</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-24">功能</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map((p, i) => (
            <tr key={p.id} className={`hover:bg-[#e8f0f8] ${i % 2 === 1 ? 'bg-kdc-table-row-alt' : ''}`}>
              <td className="px-3 py-2.5 border-b border-kdc-border">{i + 1}</td>
              <td className="px-3 py-2.5 border-b border-kdc-border font-medium">{p.name}</td>
              <td className="px-3 py-2.5 border-b border-kdc-border text-kdc-body">{p.description}</td>
              <td className="px-3 py-2.5 border-b border-kdc-border">
                <div className="flex flex-wrap gap-1">
                  {p.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-[#e8f0f8] text-kdc-primary px-2.5 py-0.5 rounded-xl text-[13px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-3 py-2.5 border-b border-kdc-border text-kdc-body">{p.updatedAt}</td>
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
                    className="bg-transparent border-none cursor-pointer text-kdc-text p-1 rounded hover:bg-[#e0e7ee] flex items-center"
                    title="複製"
                    onClick={() => doCopy(p)}
                  >
                    <IconCopy />
                  </button>
                  <button
                    className="bg-transparent border-none cursor-pointer text-kdc-text p-1 rounded hover:bg-[#e0e7ee] flex items-center"
                    title="刪除"
                    onClick={() => setDeleting(p)}
                  >
                    <IconTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination total={prompts.length} />

      {editing && (
        <Modal
          title={editing === "new" ? "新增 Prompt" : "編輯 Prompt"}
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
              placeholder="例：中文場景描述"
            />
          </div>

          <div className="mb-4">
            <label className="block text-kdc-body font-medium text-kdc-text mb-1.5">說明</label>
            <input
              className="h-9 border border-kdc-border rounded-[5px] px-2.5 text-kdc-table font-kdc outline-none w-full focus:border-kdc-primary focus:shadow-[0_0_0_2px_rgba(0,68,128,0.1)]"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="此 Prompt 的用途說明"
            />
          </div>

          <div className="mb-4">
            <label className="block text-kdc-body font-medium text-kdc-text mb-1.5">標籤</label>
            <div className="border border-kdc-border rounded-[5px] px-2.5 py-2 min-h-[44px] flex flex-wrap gap-1.5 items-center focus-within:border-kdc-primary focus-within:shadow-[0_0_0_2px_rgba(0,68,128,0.1)]">
              {form.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 bg-[#e8f0f8] text-kdc-primary px-2.5 py-0.5 rounded-xl text-[13px]">
                  {tag}
                  <button
                    type="button"
                    className="bg-transparent border-none cursor-pointer text-kdc-primary leading-none flex items-center hover:text-red-500"
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                className="outline-none border-none text-kdc-table font-kdc text-sm flex-1 min-w-[80px] bg-transparent"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder={form.tags.length === 0 ? "輸入標籤後按 Enter" : ""}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-kdc-body font-medium text-kdc-text mb-1.5">
              Prompt 內容 <span className="text-kdc-required">*</span>
            </label>
            <textarea
              className="border border-kdc-border rounded-[5px] px-2.5 py-2 font-mono text-[13px] outline-none w-full resize-y focus:border-kdc-primary focus:shadow-[0_0_0_2px_rgba(0,68,128,0.1)]"
              rows={8}
              value={form.promptBody}
              onChange={e => setForm(f => ({ ...f, promptBody: e.target.value }))}
              placeholder={'{\n  \n}'}
            />
          </div>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          message={`確定要刪除「${deleting.name}」嗎？此操作無法復原。`}
          onConfirm={() => {
            setPrompts(prev => prev.filter(p => p.id !== deleting.id));
            setDeleting(null);
          }}
          onCancel={() => setDeleting(null)}
        />
      )}

      {dupName && (
        <ConfirmDialog
          title="名稱重複"
          message={`已存在名稱為「${dupName}」的 Prompt Template，請改用其他名稱。`}
          confirmText="我知道了"
          variant="warning"
          singleButton
          onConfirm={() => setDupName(null)}
          onCancel={() => setDupName(null)}
        />
      )}
    </div>
  );
}
