import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCloudAi } from '../../context/CloudAiContext';
import { IconTrash, IconPlus } from '../../icons';
import {
  CUSTOMER_ATTRIBUTES, STATUS_OPTIONS, IMPORTANCE_OPTIONS,
  LANGUAGE_OPTIONS, GROUP_OPTIONS, SALES_OPTIONS, FAE_OPTIONS,
  SYSTEM_FEATURE_LIST, REALM_OPTIONS, ENV_OPTIONS,
} from '../../data/customersData';

// Tab 順序對齊 KDC Internal，最後一個「Cloud AI」為本模組新增（v1.15）
const TABS = [
  "聯絡資料", "報價資訊", "申請表", "系統功能", "帳號資訊",
  "產品歷程", "服務歷程", "服務概況", "財務資料", "待辦事項",
  "Cloud AI",
];

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, setCustomers } = useCloudAi();
  const customer = customers.find(c => c.id === id);
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState(customer ? { ...customer, tags: [...(customer.tags || [])] } : null);

  if (!customer) {
    return (
      <div className="bg-white border border-kdc-border rounded-[10px] p-12 text-center">
        <p className="text-kdc-body text-[#999] mb-4">查無此客戶（id: {id}）</p>
        <button
          className="bg-kdc-primary-alt text-white rounded-btn px-4 py-1.5 text-sm cursor-pointer hover:opacity-85"
          onClick={() => navigate('/customers')}
        >
          回客戶列表
        </button>
      </div>
    );
  }

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function save() {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...form } : c));
  }

  function cancel() {
    setForm({ ...customer, tags: [...(customer.tags || [])] });
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <h2
          className="text-kdc-title font-medium text-kdc-primary m-0 cursor-pointer hover:underline"
          onClick={() => navigate('/customers')}
          title="回客戶列表"
        >
          {form.name}
        </h2>
        <button className="text-kdc-text p-1 cursor-pointer hover:bg-[#e0e7ee] rounded" title="刪除客戶">
          <IconTrash />
        </button>
      </div>

      {/* 詳細資料區 */}
      <div className="bg-white border border-kdc-border rounded-[10px] p-5 mb-4">
        <div className="border-b border-kdc-border pb-2 mb-4 flex items-center justify-between">
          <span className="text-kdc-table font-medium text-kdc-text">詳細資料</span>
          <span className="text-[12px] text-[#999]">建檔人員/日期：{customer.creator}　{customer.createdAt}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <Row label="客戶代碼">
            <div className="flex items-center justify-between w-full pr-1">
              <span className="text-kdc-table">{customer.id}</span>
              <span className="text-kdc-primary text-[13px]">VID(16/10進位)：{customer.vid || "—"}</span>
            </div>
          </Row>
          <Row label="統一編號/稅號">
            <Input value={form.taxId || ""} onChange={v => set('taxId', v)} />
          </Row>
          <Row label="公司名稱"><Input value={form.name} onChange={v => set('name', v)} /></Row>
          <Row label="客戶屬性">
            <Select value={form.customerAttribute} onChange={v => set('customerAttribute', v)} options={CUSTOMER_ATTRIBUTES} />
          </Row>
          <Row label="公司地址"><Input value={form.address || ""} onChange={v => set('address', v)} /></Row>
          <Row label="正式/潛在/重要性">
            <div className="grid grid-cols-2 gap-2 w-full">
              <Select value={form.status} onChange={v => set('status', v)} options={STATUS_OPTIONS} />
              <Select value={form.importance || ""} onChange={v => set('importance', v)} options={IMPORTANCE_OPTIONS} />
            </div>
          </Row>
          <Row label="負責業務">
            <Select value={form.sales} onChange={v => set('sales', v)} options={SALES_OPTIONS} />
          </Row>
          <Row label="負責FAE">
            <Select value={form.fae || ""} onChange={v => set('fae', v)} options={FAE_OPTIONS} />
          </Row>
          <Row label="通知語系">
            <Select value={form.language} onChange={v => set('language', v)} options={LANGUAGE_OPTIONS} />
          </Row>
          <Row label="所屬群組">
            <Select value={form.group} onChange={v => set('group', v)} options={GROUP_OPTIONS} />
          </Row>
          <Row label="備註"><Input value={form.note || ""} onChange={v => set('note', v)} /></Row>
          <Row label="#Tag">
            <Input value={(form.tags || []).join(", ")} onChange={v => set('tags', v.split(/[,，]\s*/).filter(Boolean))} placeholder="Ex: #Outband, #Taipei" />
          </Row>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          <button className="bg-kdc-primary-alt text-white rounded-btn px-6 py-1.5 text-sm cursor-pointer hover:opacity-85" onClick={save}>存檔</button>
          <button className="bg-kdc-primary-alt text-white rounded-btn px-6 py-1.5 text-sm cursor-pointer hover:opacity-85" onClick={cancel}>取消</button>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <ul className="flex flex-wrap pl-[5px] m-0" role="tablist">
          {TABS.map((t, i) => (
            <li
              key={t}
              role="tab"
              aria-selected={activeTab === i}
              className={`cursor-pointer flex justify-center list-none mr-[4px] min-w-[40px] px-3 py-1.5 relative tracking-[0.05rem] font-normal text-kdc-body rounded-t-[10px] border border-transparent border-b-0 transition-colors duration-150
                ${activeTab === i
                  ? 'bg-white text-kdc-primary-alt z-10'
                  : 'bg-kdc-tab-unselected text-white'}
                ${t === 'Cloud AI' && activeTab !== i ? 'bg-kdc-primary-alt' : ''}`}
              style={{ transform: 'skew(-20deg)' }}
              onClick={() => setActiveTab(i)}
            >
              <span className="inline-block" style={{ transform: 'skew(20deg)' }}>{t}</span>
            </li>
          ))}
        </ul>
        <div className="bg-white border border-kdc-border rounded-[10px] p-5 min-h-[260px]">
          {activeTab === 0 && <ContactsTab customer={customer} />}
          {activeTab === 1 && <PlaceholderTab name="報價資訊" />}
          {activeTab === 2 && <PlaceholderTab name="申請表" />}
          {activeTab === 3 && <SystemFeaturesTab customer={customer} />}
          {activeTab === 4 && <AccountsTab customer={customer} />}
          {activeTab === 5 && <PlaceholderTab name="產品歷程" />}
          {activeTab === 6 && <PlaceholderTab name="服務歷程" />}
          {activeTab === 7 && <PlaceholderTab name="服務概況" />}
          {activeTab === 8 && <PlaceholderTab name="財務資料" />}
          {activeTab === 9 && <PlaceholderTab name="待辦事項" />}
          {activeTab === 10 && <CloudAiTab customer={customer} />}
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-kdc-body text-kdc-text shrink-0 w-[110px]">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );
}
function Input({ value, onChange, placeholder }) {
  return (
    <input
      className="h-9 border border-kdc-border rounded-[5px] px-2.5 text-kdc-table font-kdc outline-none w-full focus:border-kdc-primary focus:shadow-[0_0_0_2px_rgba(0,68,128,0.1)]"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
function Select({ value, onChange, options }) {
  return (
    <select
      className="h-9 border border-kdc-border rounded-[5px] px-2 text-kdc-table font-kdc bg-white outline-none cursor-pointer w-full focus:border-kdc-primary"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">—</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function ContactsTab({ customer }) {
  const list = customer.contacts || [];
  return (
    <div>
      <table className="w-full border-collapse text-kdc-table mb-4">
        <thead>
          <tr>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">* 聯絡人姓名</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">職稱</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">* 電話</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">* EMAIL</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-[70px]">主窗口</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-[70px]">功能</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-[100px]">更新日</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-[100px]">建檔日</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr><td colSpan={8} className="px-3 py-10 text-center text-[18px] text-[#cfd6e0]">No Records</td></tr>
          ) : list.map(ct => (
            <tr key={ct.id} className="border-b border-kdc-border">
              <td className="px-3 py-2.5">{ct.name}</td>
              <td className="px-3 py-2.5">{ct.title}</td>
              <td className="px-3 py-2.5">{ct.phone}</td>
              <td className="px-3 py-2.5 text-kdc-primary">{ct.email}</td>
              <td className="px-3 py-2.5">{ct.primary ? "✓" : ""}</td>
              <td className="px-3 py-2.5"></td>
              <td className="px-3 py-2.5">{ct.updatedAt}</td>
              <td className="px-3 py-2.5">{ct.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center">
        <button className="bg-kdc-primary-alt text-white rounded-btn px-6 py-1.5 text-sm cursor-pointer hover:opacity-85 inline-flex items-center gap-1.5">
          <IconPlus /> 新增
        </button>
      </div>
    </div>
  );
}

function SystemFeaturesTab({ customer }) {
  // 顯示既有 systemFeatures（PM 沒有編輯權限 — 純檢視）
  const features = customer.systemFeatures || {};
  return (
    <div>
      <p className="text-[12px] text-[#999] mb-3">系統功能僅供檢視（由其他團隊維護），PM 不可在此修改。</p>
      <div className="grid grid-cols-2 gap-x-12 gap-y-3 max-w-[700px]">
        {SYSTEM_FEATURE_LIST.map(f => {
          const on = !!features[f.key];
          return (
            <div key={f.key} className="flex items-center gap-3">
              <button
                disabled
                className="bg-[#e0e0e0] text-[#666] rounded-btn px-4 py-1 text-sm inline-flex items-center gap-1 cursor-not-allowed w-[150px] justify-center"
              >
                {f.label} →
              </button>
              <div className="flex items-center gap-3 text-[13px]">
                <label className="inline-flex items-center gap-1 opacity-60">
                  <input type="radio" checked={on} disabled readOnly /> ON
                </label>
                <label className="inline-flex items-center gap-1 opacity-60">
                  <input type="radio" checked={!on} disabled readOnly />
                  <span className="text-[#2e7d32]">●</span> OFF
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AccountsTab({ customer }) {
  const list = customer.accounts || [];
  return (
    <div>
      <table className="w-full border-collapse text-kdc-table mb-4">
        <thead>
          <tr>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">角色</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">帳號</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">姓名</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">系統功能</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">最近登入日期</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">建檔日期</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">申請單號</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">狀態</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr><td colSpan={8} className="px-3 py-10 text-center text-[18px] text-[#cfd6e0]">No Records</td></tr>
          ) : list.map(a => (
            <tr key={a.id} className="border-b border-kdc-border">
              <td className="px-3 py-2.5">{a.role}</td>
              <td className="px-3 py-2.5">{a.account}</td>
              <td className="px-3 py-2.5">{a.name}</td>
              <td className="px-3 py-2.5">{a.feature}</td>
              <td className="px-3 py-2.5">{a.lastLogin}</td>
              <td className="px-3 py-2.5">{a.createdAt}</td>
              <td className="px-3 py-2.5">{a.requestNo}</td>
              <td className="px-3 py-2.5">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlaceholderTab({ name }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-[#999]">
      <p className="text-[14px] mb-1">{name}</p>
      <p className="text-[12px]">（Phase 1 placeholder — 既有 KDC 功能，本 prototype 暫不復刻內容）</p>
    </div>
  );
}

function CloudAiTab({ customer }) {
  const { aiPlans, globalPlans, customerCloudAi, setCustomerCloudAi } = useCloudAi();
  const explicit = customerCloudAi[customer.id]?.bindings || [];

  // 虛擬列：globalPlans 中尚未在 bindings 出現的 plan，自動帶入一列（預設 realm/env）
  // 任何編輯動作會把虛擬列 materialize 成真實 binding 存到 customerCloudAi
  const explicitPlanIds = new Set(explicit.map(b => b.planId));
  const virtualRows = globalPlans
    .filter(pid => !explicitPlanIds.has(pid))
    .map(pid => ({
      id: `auto-${pid}`,
      realm: REALM_OPTIONS[0],
      env: ENV_OPTIONS[0],
      planId: pid,
      _virtual: true,
    }));
  const allRows = [
    ...virtualRows,
    ...explicit.map(b => ({ ...b, _virtual: false })),
  ];

  function update(patch) {
    setCustomerCloudAi(prev => ({
      ...prev,
      [customer.id]: { ...(prev[customer.id] || {}), bindings: patch },
    }));
  }

  function addBinding() {
    const newBinding = {
      id: "cb-" + Date.now(),
      realm: REALM_OPTIONS[0],
      env: ENV_OPTIONS[0],
      planId: aiPlans[0]?.id || "",
    };
    update([...explicit, newBinding]);
  }

  function materializeVirtual(virtualRow, patch) {
    const newBinding = {
      id: "cb-" + Date.now(),
      realm: virtualRow.realm,
      env: virtualRow.env,
      planId: virtualRow.planId,
      ...patch,
    };
    update([...explicit, newBinding]);
  }

  function updateRow(row, patch) {
    if (row._virtual) {
      materializeVirtual(row, patch);
    } else {
      update(explicit.map(b => b.id === row.id ? { ...b, ...patch } : b));
    }
  }

  function removeRow(row) {
    if (row._virtual) return; // 虛擬全域列不可從客戶頁刪除
    update(explicit.filter(b => b.id !== row.id));
  }

  function planLabel(plan) {
    return plan.name;
  }

  function isGlobal(planId) {
    return globalPlans.includes(planId);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-kdc-table font-medium text-kdc-primary m-0">Cloud AI 加值服務</h3>
          <p className="text-[12px] text-[#999] mt-1">
            列表自動帶入全域方案（綠 chip），可額外綁定客戶專屬方案（橘 chip）。同一 realm/env 可綁多個方案；
            全域方案要從這裡完全移除，請至「Cloud AI 設定 → 全域方案」tab 操作。
          </p>
        </div>
        <button
          className="bg-kdc-primary-alt text-white rounded-btn px-3.5 py-1.5 text-sm cursor-pointer hover:opacity-85 inline-flex items-center gap-1.5"
          onClick={addBinding}
        >
          <IconPlus /> 新增綁定
        </button>
      </div>

      <table className="w-full border-collapse text-kdc-table">
        <thead>
          <tr>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-[110px]">來源</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-[180px]">Realm</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-[140px]">Env</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border">AI Plan</th>
            <th className="text-kdc-table-header font-medium text-left px-3 py-2.5 border-b-2 border-kdc-border w-[80px]">功能</th>
          </tr>
        </thead>
        <tbody>
          {allRows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-3 py-10 text-center text-[14px] text-[#999]">
                尚未綁定任何 AI Plan — 點右上「+ 新增綁定」加入第一筆
              </td>
            </tr>
          ) : allRows.map(b => {
            const global = isGlobal(b.planId);
            return (
              <tr key={b.id} className="border-b border-kdc-border">
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-xl text-[12px] font-medium ${
                      global
                        ? 'bg-[#e8f5e9] text-[#2e7d32]'
                        : 'bg-[#fff3e0] text-[#e65100]'
                    }`}
                    title={global ? "來自 Cloud AI 設定 → 全域方案" : "客戶專屬方案"}
                  >
                    {global ? "全域" : "專屬"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <select
                    className="h-9 border border-kdc-border rounded-[5px] px-2 text-kdc-table font-kdc bg-white outline-none cursor-pointer w-full focus:border-kdc-primary"
                    value={b.realm}
                    onChange={e => updateRow(b, { realm: e.target.value })}
                  >
                    {REALM_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <select
                    className="h-9 border border-kdc-border rounded-[5px] px-2 text-kdc-table font-kdc bg-white outline-none cursor-pointer w-full focus:border-kdc-primary"
                    value={b.env}
                    onChange={e => updateRow(b, { env: e.target.value })}
                  >
                    {ENV_OPTIONS.map(env => <option key={env} value={env}>{env}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <select
                    className="h-9 border border-kdc-border rounded-[5px] px-2 text-kdc-table font-kdc bg-white outline-none cursor-pointer w-full focus:border-kdc-primary"
                    value={b.planId}
                    onChange={e => updateRow(b, { planId: e.target.value })}
                  >
                    {aiPlans.map(p => (
                      <option key={p.id} value={p.id}>{planLabel(p)}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <button
                    className={`bg-transparent border-none p-1 rounded flex items-center ${
                      b._virtual
                        ? 'opacity-25 cursor-not-allowed text-kdc-text'
                        : 'cursor-pointer text-kdc-text hover:bg-[#e0e7ee]'
                    }`}
                    title={b._virtual ? "全域方案不可從客戶頁刪除（請到 Cloud AI 設定 → 全域方案 tab 移除）" : "移除綁定"}
                    onClick={() => removeRow(b)}
                    disabled={b._virtual}
                  >
                    <IconTrash />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
