import { useState } from 'react';
import { useCloudAi } from '../../context/CloudAiContext';
import { IconPlus, IconView, IconTrash, IconChevronDown, IconChevronRight, IconClose } from '../../icons';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import Pagination from '../../components/Pagination';

const EMPTY_FORM = { name: "", vlmProfileId: "", dailyCap: "", prompts: [], defaultPromptId: null, description: "" };

let __snapSeq = Date.now();
function newSnapshotId() {
  return `ps-${++__snapSeq}`;
}

function uniqueName(base, takenSet) {
  if (!takenSet.has(base)) return base;
  let n = 2;
  while (takenSet.has(`${base} (${n})`)) n++;
  return `${base} (${n})`;
}

export default function AiPlansTab() {
  const { aiPlans, setAiPlans, vlmProfiles, prompts, globalPlans, vendorSettings, vendors } = useCloudAi();
  const [creating, setCreating] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleting, setDeleting] = useState(null);
  const [blockedDelete, setBlockedDelete] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [dupName, setDupName] = useState(null);
  const [blockedRemoveDefault, setBlockedRemoveDefault] = useState(false);

  function profileName(id) {
    return vlmProfiles.find(p => p.id === id)?.name || "—";
  }

  function usedByVendorCount(planId) {
    if (globalPlans.includes(planId)) return vendors.length;
    return vendors.filter(v => (vendorSettings[v.id]?.specificPlans || []).includes(planId)).length;
  }

  function snapshotFromTemplate(template, takenNames) {
    const name = uniqueName(template.name, takenNames);
    return {
      id: newSnapshotId(),
      sourceTemplateId: template.id,
      sourceName: template.name,
      name,
      promptBody: template.promptBody,
      modified: false,
    };
  }

  function blankSnapshot(takenNames) {
    const name = uniqueName("自建 Prompt", takenNames);
    return {
      id: newSnapshotId(),
      sourceTemplateId: null,
      sourceName: null,
      name,
      promptBody: '{\n  \n}',
      modified: false,
    };
  }

  function openNew() {
    const defaultPrompt = prompts.find(p => p.name === "中文場景描述");
    const initialPrompts = defaultPrompt ? [snapshotFromTemplate(defaultPrompt, new Set())] : [];
    setForm({
      ...EMPTY_FORM,
      prompts: initialPrompts,
      defaultPromptId: initialPrompts[0]?.id || null,
      vlmProfileId: vlmProfiles[0]?.id || "",
    });
    setExpanded({});
    setCreating(true);
  }

  function closeCreate() {
    setCreating(false);
    setForm(EMPTY_FORM);
    setExpanded({});
  }

  function addFromTemplates(templateIds) {
    setForm(f => {
      const taken = new Set((f.prompts || []).map(p => p.name));
      const newSnaps = [];
      for (const tid of templateIds) {
        const t = prompts.find(p => p.id === tid);
        if (!t) continue;
        const snap = snapshotFromTemplate(t, taken);
        taken.add(snap.name);
        newSnaps.push(snap);
      }
      const merged = [...(f.prompts || []), ...newSnaps];
      // 若原本沒有預設（清單為空才會發生），把第一個新加的設為預設
      const defaultId = f.defaultPromptId || newSnaps[0]?.id || null;
      return { ...f, prompts: merged, defaultPromptId: defaultId };
    });
    setPickerOpen(false);
  }

  function addCustom() {
    setForm(f => {
      const taken = new Set((f.prompts || []).map(p => p.name));
      const snap = blankSnapshot(taken);
      // 自建卡片預設展開以便編輯
      setExpanded(e => ({ ...e, [snap.id]: true }));
      const defaultId = f.defaultPromptId || snap.id;
      return { ...f, prompts: [...(f.prompts || []), snap], defaultPromptId: defaultId };
    });
  }

  function setDefaultPrompt(snapId) {
    setForm(f => ({ ...f, defaultPromptId: snapId }));
  }

  function updateSnap(snapId, patch) {
    setForm(f => ({
      ...f,
      prompts: (f.prompts || []).map(p => {
        if (p.id !== snapId) return p;
        const next = { ...p, ...patch };
        // 來自模板且 name 或 body 被改 → 標記 modified
        if (p.sourceTemplateId && (patch.name !== undefined || patch.promptBody !== undefined)) {
          next.modified = true;
        }
        return next;
      }),
    }));
  }

  function removeSnap(snapId) {
    // 預設 prompt 不可直接刪除，強迫 PM 先把預設換到其他卡片
    if (snapId === form.defaultPromptId) {
      setBlockedRemoveDefault(true);
      return;
    }
    setForm(f => ({ ...f, prompts: (f.prompts || []).filter(p => p.id !== snapId) }));
    setExpanded(e => { const n = { ...e }; delete n[snapId]; return n; });
  }

  function toggleExpand(snapId) {
    setExpanded(e => ({ ...e, [snapId]: !e[snapId] }));
  }

  function save() {
    if (!form.name.trim()) return;
    if ((form.prompts || []).length === 0) return;
    // in-plan name 唯一性
    const names = (form.prompts || []).map(p => p.name.trim());
    const dup = names.find((n, i) => !n || names.indexOf(n) !== i);
    if (dup !== undefined) {
      setDupName(dup || "（空白）");
      return;
    }
    const dailyCap = form.dailyCap === "" || form.dailyCap === null ? null : Number(form.dailyCap);
    const now = new Date().toISOString().slice(0, 10);
    const promptSnapshots = (form.prompts || []).map(s => ({
      id: s.id,
      sourceTemplateId: s.sourceTemplateId,
      sourceName: s.sourceName,
      name: s.name.trim(),
      promptBody: s.promptBody,
      snapshotAt: now,
      modified: !!s.modified,
    }));
    setAiPlans(prev => [...prev, {
      id: "plan-" + Date.now(),
      name: form.name.trim(),
      vlmProfileId: form.vlmProfileId,
      dailyCap,
      description: form.description,
      prompts: promptSnapshots,
      defaultPromptId: form.defaultPromptId,
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

  const isFormValid =
    form.name.trim() &&
    (form.prompts || []).length > 0 &&
    (form.prompts || []).every(p => p.name.trim()) &&
    !!form.defaultPromptId;

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

          <PromptsBuilder
            snaps={form.prompts || []}
            defaultPromptId={form.defaultPromptId}
            expanded={expanded}
            onToggleExpand={toggleExpand}
            onUpdate={updateSnap}
            onRemove={removeSnap}
            onSetDefault={setDefaultPrompt}
            onOpenPicker={() => setPickerOpen(true)}
            onAddCustom={addCustom}
          />

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

      {pickerOpen && (
        <TemplatePickerDialog
          templates={prompts}
          onConfirm={addFromTemplates}
          onClose={() => setPickerOpen(false)}
        />
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

      {dupName !== null && (
        <ConfirmDialog
          title="Prompt 名稱重複"
          message={`方案內已存在名稱為「${dupName}」的 Prompt，請改用其他名稱。`}
          confirmText="我知道了"
          variant="warning"
          singleButton
          onConfirm={() => setDupName(null)}
          onCancel={() => setDupName(null)}
        />
      )}

      {blockedRemoveDefault && (
        <ConfirmDialog
          title="無法刪除預設 Prompt"
          message="預設 Prompt 不可直接刪除，請先將其他 Prompt 設為預設後再刪除。"
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

function PromptsBuilder({ snaps, defaultPromptId, expanded, onToggleExpand, onUpdate, onRemove, onSetDefault, onOpenPicker, onAddCustom }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-kdc-body font-medium text-kdc-text">
          Prompts <span className="text-kdc-required">*</span>
          <span className="text-[#999] text-xs font-normal ml-1">（從模板加入或自建，皆為此方案私有副本；恰一個為預設執行）</span>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            className="bg-white text-kdc-primary border border-kdc-primary rounded-btn px-2.5 py-1 text-[12px] cursor-pointer inline-flex items-center gap-1 hover:bg-[#e8f0f8]"
            onClick={onOpenPicker}
          >
            <IconPlus /> 從模板加入
          </button>
          <button
            type="button"
            className="bg-white text-kdc-primary border border-kdc-primary rounded-btn px-2.5 py-1 text-[12px] cursor-pointer inline-flex items-center gap-1 hover:bg-[#e8f0f8]"
            onClick={onAddCustom}
          >
            <IconPlus /> 自建 Prompt
          </button>
        </div>
      </div>

      {snaps.length === 0 ? (
        <div className="border border-dashed border-kdc-border rounded-[5px] px-3 py-6 text-center text-[#999] text-[13px]">
          尚未加入 Prompt — 請從模板加入或自建
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {snaps.map(snap => {
            const isOpen = !!expanded[snap.id];
            const isCustom = !snap.sourceTemplateId;
            const isDefault = snap.id === defaultPromptId;
            return (
              <div
                key={snap.id}
                className={`border rounded-[5px] bg-white border-l-[4px] ${
                  isDefault ? 'border-kdc-border border-l-[#2e7d32]' : 'border-kdc-border border-l-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-kdc-border bg-[#fafafa]">
                  <label
                    className="inline-flex items-center gap-1 cursor-pointer text-[12px] text-kdc-text px-1.5 py-0.5 rounded hover:bg-[#e0e7ee]"
                    title="設為預設"
                  >
                    <input
                      type="radio"
                      name="default-prompt"
                      checked={isDefault}
                      onChange={() => onSetDefault(snap.id)}
                      className="cursor-pointer"
                    />
                    <span>預設</span>
                  </label>
                  <button
                    type="button"
                    className="bg-transparent border-none p-0.5 cursor-pointer flex items-center"
                    onClick={() => onToggleExpand(snap.id)}
                    title={isOpen ? "收合" : "展開"}
                  >
                    {isOpen ? <IconChevronDown /> : <IconChevronRight />}
                  </button>
                  <input
                    className="flex-1 h-7 border border-kdc-border rounded-[4px] px-2 text-kdc-body font-kdc outline-none focus:border-kdc-primary"
                    value={snap.name}
                    onChange={e => onUpdate(snap.id, { name: e.target.value })}
                    placeholder="Prompt 名稱"
                  />
                  {isDefault && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-xl text-[11px] font-medium whitespace-nowrap bg-[#e8f5e9] text-[#2e7d32]">
                      預設
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-xl text-[11px] font-medium whitespace-nowrap ${
                      isCustom
                        ? 'bg-[#fff3e0] text-[#e65100]'
                        : 'bg-[#e8f0f8] text-kdc-primary'
                    }`}
                    title={isCustom ? "自建" : `源自模板：${snap.sourceName}`}
                  >
                    {isCustom ? "自建" : `源自：${snap.sourceName}`}
                    {snap.modified && !isCustom && (
                      <span className="ml-1 text-[#e65100]">・已修改</span>
                    )}
                  </span>
                  <button
                    type="button"
                    className="bg-transparent border-none cursor-pointer text-kdc-text p-1 rounded hover:bg-[#e0e7ee] flex items-center"
                    onClick={() => onRemove(snap.id)}
                    title="移除"
                  >
                    <IconClose />
                  </button>
                </div>
                {isOpen && (
                  <div className="px-2.5 py-2">
                    <label className="block text-[12px] text-[#999] mb-1">Prompt 內容（JSON）</label>
                    <textarea
                      className="border border-kdc-border rounded-[5px] px-2 py-1.5 font-mono text-[12px] outline-none w-full resize-y focus:border-kdc-primary"
                      rows={6}
                      value={snap.promptBody}
                      onChange={e => onUpdate(snap.id, { promptBody: e.target.value })}
                      placeholder={'{\n  \n}'}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <p className="text-xs text-[#999] mt-1">已加入 {snaps.length} 個 Prompt（綠色直條為預設）</p>
    </div>
  );
}

function TemplatePickerDialog({ templates, onConfirm, onClose }) {
  const [selected, setSelected] = useState([]);

  function toggle(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  return (
    <Modal
      title="從模板加入 Prompt"
      onClose={onClose}
      footer={
        <>
          <button
            className="px-3.5 py-1.5 text-sm rounded-btn border border-kdc-primary bg-white text-kdc-primary cursor-pointer hover:opacity-85"
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="px-3.5 py-1.5 text-sm rounded-btn border border-kdc-border bg-kdc-primary-alt text-white cursor-pointer hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onConfirm(selected)}
            disabled={selected.length === 0}
          >
            加入 {selected.length > 0 ? `(${selected.length})` : ''}
          </button>
        </>
      }
    >
      <p className="text-[12px] text-[#999] mb-2">
        模板內容會被深拷貝為此方案的私有副本，加入後仍可編輯，且不會回寫模板。
      </p>
      <div className="border border-kdc-border rounded-[5px] max-h-[300px] overflow-y-auto">
        {templates.map(p => {
          const checked = selected.includes(p.id);
          return (
            <label
              key={p.id}
              className={`flex items-center px-3 py-2 border-b border-kdc-border cursor-pointer hover:bg-[#f0f7ff] ${checked ? 'bg-[#f0f7ff]' : ''}`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(p.id)}
                className="mr-2.5 w-[18px] h-[18px]"
              />
              <span className="flex-1">
                <span className="text-kdc-body font-medium">{p.name}</span>
                <span className="text-[#999] text-xs ml-2">({(p.tags || []).join(", ")})</span>
              </span>
            </label>
          );
        })}
      </div>
    </Modal>
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
            const isCustom = !snap.sourceTemplateId;
            const isDefault = snap.id === plan.defaultPromptId;
            return (
              <div key={snap.id} className={`${i > 0 ? "border-t border-kdc-border" : ""} border-l-[4px] ${isDefault ? 'border-l-[#2e7d32]' : 'border-l-transparent'}`}>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 bg-transparent border-none cursor-pointer hover:bg-[#f0f7ff] text-left"
                  onClick={() => toggle(snap.id)}
                >
                  {isOpen ? <IconChevronDown /> : <IconChevronRight />}
                  <span className="flex-1 text-kdc-body font-medium">{snap.name}</span>
                  {isDefault && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-xl text-[11px] font-medium whitespace-nowrap bg-[#e8f5e9] text-[#2e7d32]">
                      預設
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-xl text-[11px] font-medium whitespace-nowrap ${
                      isCustom ? 'bg-[#fff3e0] text-[#e65100]' : 'bg-[#e8f0f8] text-kdc-primary'
                    }`}
                  >
                    {isCustom ? "自建" : `源自：${snap.sourceName}`}
                    {snap.modified && !isCustom && (
                      <span className="ml-1 text-[#e65100]">・已修改</span>
                    )}
                  </span>
                  {snap.snapshotAt && (
                    <span className="text-[11px] text-[#999]">{snap.snapshotAt}</span>
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
