import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloudAi } from '../../context/CloudAiContext';
import { IconPlus } from '../../icons';
import Pagination from '../../components/Pagination';
import {
  CUSTOMER_ATTRIBUTES, STATUS_OPTIONS, IMPORTANCE_OPTIONS, SALES_OPTIONS, FAE_OPTIONS,
} from '../../data/customersData';

const EMPTY_FILTERS = {
  idVid: "",
  name: "",
  contact: "",
  attribute: "",
  status: "",
  importance: "",
  tag: "",
  productSdk: "",
  sales: "",
  fae: "",
  systemAccount: "",
};

export default function CustomerList() {
  const { customers } = useCloudAi();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [submittedFilters, setSubmittedFilters] = useState(null); // null = 未查詢

  const filtered = useMemo(() => {
    if (!submittedFilters) return null;
    return customers.filter(c => {
      if (submittedFilters.idVid && !`${c.id} ${c.vid || ''}`.toLowerCase().includes(submittedFilters.idVid.toLowerCase())) return false;
      if (submittedFilters.name && !c.name.toLowerCase().includes(submittedFilters.name.toLowerCase())) return false;
      if (submittedFilters.contact) {
        const hit = (c.contacts || []).some(ct => ct.name.toLowerCase().includes(submittedFilters.contact.toLowerCase()));
        if (!hit) return false;
      }
      if (submittedFilters.attribute && c.customerAttribute !== submittedFilters.attribute) return false;
      if (submittedFilters.status && c.status !== submittedFilters.status) return false;
      if (submittedFilters.importance && c.importance !== submittedFilters.importance) return false;
      if (submittedFilters.tag && !(c.tags || []).some(t => t.toLowerCase().includes(submittedFilters.tag.toLowerCase()))) return false;
      if (submittedFilters.productSdk && !(c.productSdk || "").toLowerCase().includes(submittedFilters.productSdk.toLowerCase())) return false;
      if (submittedFilters.sales && c.sales !== submittedFilters.sales) return false;
      if (submittedFilters.fae && c.fae !== submittedFilters.fae) return false;
      return true;
    });
  }, [customers, submittedFilters]);

  function set(k, v) {
    setFilters(f => ({ ...f, [k]: v }));
  }

  function submit() {
    setSubmittedFilters({ ...filters });
  }

  function primaryContact(c) {
    return (c.contacts || []).find(ct => ct.primary) || (c.contacts || [])[0];
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-kdc-title font-medium text-kdc-primary m-0">客戶列表</h2>
        <button className="bg-kdc-primary-alt text-white rounded-btn px-3.5 py-1.5 text-sm border border-kdc-border cursor-pointer inline-flex items-center gap-1.5 hover:opacity-85">
          <IconPlus /> 新增客戶
        </button>
      </div>

      {/* 搜尋條件 */}
      <div className="bg-white border border-kdc-border rounded-[10px] p-4 mb-4">
        <div className="grid grid-cols-6 gap-3 mb-3">
          <input className="h-9 border border-kdc-border rounded-[18px] px-3 text-kdc-table font-kdc outline-none focus:border-kdc-primary"
            placeholder="客戶代碼/VID"
            value={filters.idVid} onChange={e => set('idVid', e.target.value)} />
          <input className="h-9 border border-kdc-border rounded-[18px] px-3 text-kdc-table font-kdc outline-none focus:border-kdc-primary"
            placeholder="公司名稱"
            value={filters.name} onChange={e => set('name', e.target.value)} />
          <input className="h-9 border border-kdc-border rounded-[18px] px-3 text-kdc-table font-kdc outline-none focus:border-kdc-primary"
            placeholder="聯絡人"
            value={filters.contact} onChange={e => set('contact', e.target.value)} />
          <select className="h-9 border border-kdc-border rounded-[18px] px-3 text-kdc-table font-kdc bg-white outline-none cursor-pointer focus:border-kdc-primary"
            value={filters.attribute} onChange={e => set('attribute', e.target.value)}>
            <option value="">客戶屬性</option>
            {CUSTOMER_ATTRIBUTES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select className="h-9 border border-kdc-border rounded-[18px] px-3 text-kdc-table font-kdc bg-white outline-none cursor-pointer focus:border-kdc-primary"
            value={filters.status} onChange={e => set('status', e.target.value)}>
            <option value="">正式/潛在</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="h-9 border border-kdc-border rounded-[18px] px-3 text-kdc-table font-kdc bg-white outline-none cursor-pointer focus:border-kdc-primary"
            value={filters.importance} onChange={e => set('importance', e.target.value)}>
            <option value="">重要性</option>
            {IMPORTANCE_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-3 items-center">
          <input className="h-9 border border-kdc-border rounded-[18px] px-3 text-kdc-table font-kdc outline-none focus:border-kdc-primary"
            placeholder="#tag"
            value={filters.tag} onChange={e => set('tag', e.target.value)} />
          <input className="h-9 border border-kdc-border rounded-[18px] px-3 text-kdc-table font-kdc outline-none focus:border-kdc-primary"
            placeholder="產品/SDK"
            value={filters.productSdk} onChange={e => set('productSdk', e.target.value)} />
          <select className="h-9 border border-kdc-border rounded-[18px] px-3 text-kdc-table font-kdc bg-white outline-none cursor-pointer focus:border-kdc-primary"
            value={filters.sales} onChange={e => set('sales', e.target.value)}>
            <option value="">業務</option>
            {SALES_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="h-9 border border-kdc-border rounded-[18px] px-3 text-kdc-table font-kdc bg-white outline-none cursor-pointer focus:border-kdc-primary"
            value={filters.fae} onChange={e => set('fae', e.target.value)}>
            <option value="">FAE</option>
            {FAE_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <input className="h-9 border border-kdc-border rounded-[18px] px-3 text-kdc-table font-kdc outline-none focus:border-kdc-primary"
            placeholder="系統帳號"
            value={filters.systemAccount} onChange={e => set('systemAccount', e.target.value)} />
          <button
            className="bg-kdc-primary-alt text-white rounded-btn px-6 h-9 text-sm border border-kdc-border cursor-pointer hover:opacity-85"
            onClick={submit}
          >
            查詢
          </button>
        </div>
      </div>

      {/* 結果區 */}
      {!filtered ? (
        <div className="bg-white border border-kdc-border rounded-[10px] p-12 text-center text-[20px] text-[#cfd6e0]">
          查詢客戶列表
        </div>
      ) : (
        <div className="bg-white border border-kdc-border rounded-[10px] overflow-hidden">
          <table className="w-full border-collapse text-kdc-table">
            <thead>
              <tr className="bg-white">
                <th className="text-kdc-table-header font-medium text-left px-3 py-3 border-b border-kdc-border w-[110px]">客戶代碼</th>
                <th className="text-kdc-table-header font-medium text-left px-3 py-3 border-b border-kdc-border">公司名稱</th>
                <th className="text-kdc-table-header font-medium text-left px-3 py-3 border-b border-kdc-border">聯絡資訊</th>
                <th className="text-kdc-table-header font-medium text-left px-3 py-3 border-b border-kdc-border w-[120px]">客戶屬性</th>
                <th className="text-kdc-table-header font-medium text-left px-3 py-3 border-b border-kdc-border w-[80px]">正式/潛在</th>
                <th className="text-kdc-table-header font-medium text-left px-3 py-3 border-b border-kdc-border w-[110px]">業務</th>
                <th className="text-kdc-table-header font-medium text-left px-3 py-3 border-b border-kdc-border w-[80px]">FAE</th>
                <th className="text-kdc-table-header font-medium text-left px-3 py-3 border-b border-kdc-border w-[140px]">產品名稱/SDK版本</th>
                <th className="text-kdc-table-header font-medium text-left px-3 py-3 border-b border-kdc-border w-[60px]">重要性</th>
                <th className="text-kdc-table-header font-medium text-left px-3 py-3 border-b border-kdc-border w-[120px]">更新日</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const ct = primaryContact(c);
                return (
                  <tr key={c.id} className="border-b border-kdc-border hover:bg-[#f5f9fc]">
                    <td className="px-3 py-3 align-top">{c.id}</td>
                    <td className="px-3 py-3 align-top">
                      <span
                        className="text-kdc-primary cursor-pointer hover:underline"
                        onClick={() => navigate(`/customers/${c.id}`)}
                      >
                        {c.name}
                      </span>
                    </td>
                    <td className="px-3 py-3 align-top">
                      {ct ? (
                        <>
                          <div>{ct.name} / {ct.title}</div>
                          {ct.phone && <div className="text-[13px]">{ct.phone}</div>}
                          {ct.email && <div className="text-[13px] text-kdc-primary hover:underline cursor-pointer">{ct.email}</div>}
                        </>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 align-top">{c.customerAttribute}</td>
                    <td className="px-3 py-3 align-top">{c.status}</td>
                    <td className="px-3 py-3 align-top">{c.sales}</td>
                    <td className="px-3 py-3 align-top">{c.fae}</td>
                    <td className="px-3 py-3 align-top">
                      {c.productSdk && (
                        <span className="text-kdc-primary hover:underline cursor-pointer">{c.productSdk}</span>
                      )}
                    </td>
                    <td className="px-3 py-3 align-top">{c.importance}</td>
                    <td className="px-3 py-3 align-top text-[13px]">
                      <div>{c.updatedBy}</div>
                      <div>{c.updatedAt}</div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-3 py-12 text-center text-[#999]">查無符合條件的客戶</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-4 py-3">
            <Pagination total={filtered.length} />
          </div>
        </div>
      )}
    </div>
  );
}
