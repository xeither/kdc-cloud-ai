import { useState } from 'react';
import { useCloudAi } from '../../context/CloudAiContext';
import { IconCalendar } from '../../icons';
import Toggle from '../../components/Toggle';

export default function VsaasApplicationForm() {
  const { aiPlans, globalPlans, customers, customerCloudAi } = useCloudAi();
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerInput, setCustomerInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [f, setF] = useState({
    customerId: "", salesPerson: "",
    serviceType: "test", piPoNo: "", region: [], paymentStatus: "prepaid",
    paymentRef: "", creditTerm: "", overdueStatus: "none", overdueCurrency: "USD", overdueAmount: "",
    recordType: "event", autoRenew: false, recordSeconds: "30", cycleDelete: true,
    plan: "7/30", customPlan: "", capacity: "", quantity: 0, startDate: "",
    purchaseType: "new", realm: "", serverToServer: false,
    amUrl: "", authUrl: "", refreshUrl: "", tokenUrl: "",
    userInfoUrl: "", logoutUrl: "", clientId: "", clientSecret: "",
    cloudAiEnabled: false, cloudAiPlan: "", notes: "",
  });

  const u = (key, val) => setF(prev => ({ ...prev, [key]: val }));
  // region 與 serviceType 影響 AI Plan scope，變動時清空已選的 AI Plan
  const toggleRegion = (r) => {
    setF(prev => {
      const cur = prev.region;
      const next = cur.includes(r) ? cur.filter(x => x !== r) : [...cur, r];
      return { ...prev, region: next, cloudAiPlan: "" };
    });
  };
  const setServiceType = (val) => {
    setF(prev => ({ ...prev, serviceType: val, cloudAiPlan: "" }));
  };
  const planName = (id) => aiPlans.find(p => p.id === id)?.name || id;

  // 客戶顯示字串：「客戶代碼(VID) 公司名稱」對齊 KDC 原 autocomplete 格式
  const customerLabel = (c) => `${c.id}(${c.vid}) ${c.name}`;

  // Autocomplete: filter by id, vid, or name
  const filteredCustomers = customerInput.trim() === ""
    ? customers
    : customers.filter(c =>
        c.id.toLowerCase().includes(customerInput.toLowerCase()) ||
        (c.vid || "").toLowerCase().includes(customerInput.toLowerCase()) ||
        c.name.toLowerCase().includes(customerInput.toLowerCase())
      );

  const handleCustomerInputChange = (val) => {
    setCustomerInput(val);
    setShowSuggestions(true);
    // If typed value no longer matches the selected customer's display string, clear selection
    if (selectedCustomerId) {
      const sel = customers.find(c => c.id === selectedCustomerId);
      if (sel && val !== customerLabel(sel)) {
        setSelectedCustomerId("");
        u("customerId", "");
        u("cloudAiPlan", "");
      }
    }
  };

  const selectCustomer = (customer) => {
    setCustomerInput(customerLabel(customer));
    setSelectedCustomerId(customer.id);
    u("customerId", customer.id);
    u("cloudAiPlan", "");
    setShowSuggestions(false);
  };

  // v1.19：AI Plan 選項依 (customer, region, env) 計算
  //   - region 取自申請單「地區」欄位（Cloud AI 啟用時限制單選）
  //   - env 由「服務啟用性質」決定：測試→STG / 正式→Prod
  //   - 該客戶在此 (region, env) scope 下啟用的 plans = 共用 + selectedSpecificPlanIds
  const derivedEnv = f.serviceType === "formal" ? "Prod" : "STG";
  const derivedRegion = f.region.length === 1 ? f.region[0] : null;
  const aiPlanGuard = (() => {
    if (!f.cloudAiEnabled) return null;
    if (!selectedCustomerId) return "請先選擇客戶";
    if (f.region.length === 0) return "請先勾選地區";
    if (f.region.length > 1) return "Cloud AI 啟用時，地區只能單選（每個 region 對應獨立 server）";
    return null;
  })();
  const selectedSpecific = customerCloudAi[selectedCustomerId]?.selectedSpecificPlanIds || [];
  const aiPlanOptions = derivedRegion && selectedCustomerId
    ? aiPlans.filter(p => {
        if (p.region !== derivedRegion || p.env !== derivedEnv) return false;
        return globalPlans.includes(p.id) || selectedSpecific.includes(p.id);
      }).map(p => ({ planId: p.id, _global: globalPlans.includes(p.id) }))
    : [];

  const labelCls = "bg-kdc-form-label px-4 py-2.5 text-kdc-body flex items-center justify-end min-w-[160px] max-w-[160px] text-right text-kdc-text whitespace-nowrap";
  const labelDarkCls = "bg-kdc-form-label-dark px-4 py-2.5 text-kdc-body flex items-center justify-end min-w-[160px] max-w-[160px] text-right text-kdc-text whitespace-nowrap";
  const valCls = "flex-1 px-4 py-2 flex items-center gap-2 flex-wrap text-kdc-body";
  const inputCls = "h-9 border border-kdc-border rounded-[5px] px-2.5 text-kdc-table font-kdc outline-none focus:border-kdc-primary focus:shadow-[0_0_0_2px_rgba(0,68,128,0.1)]";
  const selectCls = "h-9 border border-kdc-border rounded-[5px] px-2 text-kdc-table font-kdc bg-white outline-none cursor-pointer focus:border-kdc-primary";

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-kdc-title font-medium text-kdc-primary">新增—VSaaS 使用申請單</h2>
      </div>
      <div className="mb-4">
        <select className={`${selectCls} w-[300px] h-10`}><option>VSaaS 使用申請單</option></select>
      </div>

      {/* Section 1: Basic Info */}
      <div className="mb-4">
        <div className="flex border-b border-kdc-border">
          <div className={labelCls}>申請單號 :</div>
          <div className={`${valCls} flex-1`}><span className="text-[#999]">自動產生</span></div>
          <div className={labelCls}>申請日期 :</div>
          <div className={`${valCls} flex-1`}><span className="text-[#999]">送出後產生</span></div>
        </div>
        <div className="flex border-b border-kdc-border">
          <div className={labelCls}><span className="text-kdc-required mr-0.5">*</span>客戶代碼(VID)/名稱 :</div>
          <div className={`${valCls} flex-1`}>
            <div className="relative">
              <input
                className={`${inputCls} w-[360px]`}
                value={customerInput}
                onChange={e => handleCustomerInputChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="輸入客戶代碼 / VID / 客戶名稱"
              />
              {showSuggestions && filteredCustomers.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-[360px] bg-white border border-kdc-border rounded-[5px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                  {filteredCustomers.map(c => (
                    <div
                      key={c.id}
                      className="px-3 py-2 cursor-pointer hover:bg-[#e8f0f8] text-kdc-body flex items-center gap-3"
                      onMouseDown={() => selectCustomer(c)}
                    >
                      <span className="text-[#666] font-mono text-[13px]">{c.id}({c.vid})</span>
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={labelCls}>備註 :</div>
          <div className={`${valCls} flex-1`}><textarea className="border border-kdc-border rounded-[5px] px-2.5 py-2 text-kdc-body font-kdc outline-none w-full resize-y min-h-[50px]" rows={2} value={f.notes} onChange={e => u("notes", e.target.value)} /></div>
        </div>
        <div className="flex border-b border-kdc-border">
          <div className={labelCls}>負責業務 :</div>
          <div className={valCls}><input className={`${inputCls} w-[200px]`} value={f.salesPerson} onChange={e => u("salesPerson", e.target.value)} /></div>
        </div>
        <div className="flex border-b border-kdc-border">
          <div className={labelCls}><span className="text-kdc-required mr-0.5">*</span>服務啟用性質 :</div>
          <div className={`${valCls} flex-1`}>
            <label className="flex items-center gap-1"><input type="radio" name="serviceType" checked={f.serviceType === "test"} onChange={() => setServiceType("test")} /> 測試</label>
            <label className="flex items-center gap-1"><input type="radio" name="serviceType" checked={f.serviceType === "formal"} onChange={() => setServiceType("formal")} /> 正式</label>
            {f.serviceType === "formal" && <span className="flex items-center gap-1">(PI/PO no. <input className={`${inputCls} w-[140px]`} value={f.piPoNo} onChange={e => u("piPoNo", e.target.value)} /> )</span>}
          </div>
          <div className={labelCls}><span className="text-kdc-required mr-0.5">*</span>地區 :</div>
          <div className={`${valCls} flex-1`}>
            {["美洲", "中國", "亞洲", "歐洲"].map(r => (
              <label key={r} className="flex items-center gap-1"><input type="checkbox" checked={f.region.includes(r)} onChange={() => toggleRegion(r)} /> {r}</label>
            ))}
          </div>
        </div>
        <div className="flex border-b border-kdc-border">
          <div className={labelCls}><span className="text-kdc-required mr-0.5">*</span>收款資訊 :</div>
          <div className={valCls}>
            <label className="flex items-center gap-1"><input type="radio" name="payment" checked={f.paymentStatus === "prepaid"} onChange={() => u("paymentStatus", "prepaid")} /> 已預收款項，通知單編號</label>
            <input className={`${inputCls} w-[140px]`} value={f.paymentRef} onChange={e => u("paymentRef", e.target.value)} />
            <label className="flex items-center gap-1 ml-6"><input type="radio" name="payment" checked={f.paymentStatus === "credit"} onChange={() => u("paymentStatus", "credit")} /> 賒銷，收款條件</label>
            <input className={`${inputCls} w-[140px]`} value={f.creditTerm} onChange={e => u("creditTerm", e.target.value)} />
          </div>
        </div>
        <div className="flex">
          <div className={labelCls}><span className="text-kdc-required mr-0.5">*</span>逾期款項 :</div>
          <div className={valCls}>
            <label className="flex items-center gap-1"><input type="radio" name="overdue" checked={f.overdueStatus === "none"} onChange={() => u("overdueStatus", "none")} /> 無</label>
            <label className="flex items-center gap-1"><input type="radio" name="overdue" checked={f.overdueStatus === "overdue"} onChange={() => u("overdueStatus", "overdue")} /> 逾期款項</label>
            {f.overdueStatus === "overdue" && <>
              <span>幣別/金額</span>
              <select className={selectCls} value={f.overdueCurrency} onChange={e => u("overdueCurrency", e.target.value)}>
                <option value="USD">美金</option><option value="TWD">台幣</option><option value="CNY">人民幣</option><option value="JPY">日幣</option>
              </select>
              <input className={`${inputCls} w-[120px]`} value={f.overdueAmount} onChange={e => u("overdueAmount", e.target.value)} />
            </>}
          </div>
        </div>
      </div>

      {/* Section 2: Service Config */}
      <div className="mb-4">
        <div className="flex border-b border-kdc-border">
          <div className={labelDarkCls}><span className="text-kdc-required mr-0.5">*</span>類型 :</div>
          <div className={`${valCls} flex-1`}>
            <label className="flex items-center gap-1"><input type="radio" name="recordType" checked={f.recordType === "event"} onChange={() => u("recordType", "event")} /> 事件錄影</label>
            <label className="flex items-center gap-1"><input type="radio" name="recordType" checked={f.recordType === "fulltime"} onChange={() => u("recordType", "fulltime")} /> 全時錄影</label>
          </div>
          <div className={labelDarkCls}>Auto renew :</div>
          <div className={`${valCls} flex-1`}>
            <label className="flex items-center gap-1 text-[13px]"><input type="checkbox" checked={f.autoRenew} onChange={e => u("autoRenew", e.target.checked)} /> 是 <span className="text-[#999] text-xs">(勾選後終端客戶的合約會每月自動續費)</span></label>
          </div>
        </div>
        <div className="flex border-b border-kdc-border">
          <div className={labelDarkCls}><span className="text-kdc-required mr-0.5">*</span>錄影秒數 :</div>
          <div className={`${valCls} flex-1`}>
            <select className={selectCls} value={f.recordSeconds} onChange={e => u("recordSeconds", e.target.value)}>
              <option value="30">30</option><option value="60">60</option><option value="86400">86400</option>
            </select>
          </div>
          <div className={labelDarkCls}><span className="text-kdc-required mr-0.5">*</span>循環錄影 :</div>
          <div className={`${valCls} flex-1`}>
            <label className="flex items-center gap-1 text-[13px]"><input type="checkbox" checked={f.cycleDelete} onChange={e => u("cycleDelete", e.target.checked)} /> 是 <span className="text-[#999] text-xs">(容量已滿時會自動刪除最早的事件)</span></label>
          </div>
        </div>
        <div className="flex border-b border-kdc-border">
          <div className={labelDarkCls}><span className="text-kdc-required mr-0.5">*</span>方案 :</div>
          <div className={`${valCls} flex-1`}>
            {["7/30", "30/30"].map(p => (
              <label key={p} className="flex items-center gap-1"><input type="radio" name="plan" checked={f.plan === p} onChange={() => u("plan", p)} /> {p}</label>
            ))}
            <label className="flex items-center gap-1"><input type="radio" name="plan" checked={f.plan === "custom"} onChange={() => u("plan", "custom")} /> 客製</label>
            {f.plan === "custom" && <select className={selectCls} value={f.customPlan} onChange={e => u("customPlan", e.target.value)}><option value="">請選擇</option><option>3/30 (10)</option><option>7/4 (10)</option><option>7/7 (10)</option></select>}
          </div>
          <div className={labelDarkCls}><span className="text-kdc-required mr-0.5">*</span>容量 :</div>
          <div className={`${valCls} flex-1`}><input className={`${inputCls} w-[120px]`} value={f.capacity} onChange={e => u("capacity", e.target.value)} /></div>
        </div>
        <div className="flex">
          <div className={labelDarkCls}><span className="text-kdc-required mr-0.5">*</span>預定服務起迄日 :</div>
          <div className={`${valCls} flex-1`}>
            <span className="flex items-center gap-1"><IconCalendar /><input className={`${inputCls} w-[180px]`} type="date" value={f.startDate} onChange={e => u("startDate", e.target.value)} /></span>
          </div>
          <div className={labelDarkCls}><span className="text-kdc-required mr-0.5">*</span>數量 :</div>
          <div className={`${valCls} flex-1 flex items-center gap-2`}>
            <input className={`${inputCls} w-[100px]`} type="number" value={f.quantity} onChange={e => u("quantity", Number(e.target.value))} />
            <span>個</span>
            <button className="text-kdc-primary-alt bg-transparent border-none cursor-pointer p-0 leading-none" title="新增">
              <svg width={25} height={25} viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm192 472c0 4.4-3.6 8-8 8H544v152c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V544H328c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h152V328c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v152h152c4.4 0 8 3.6 8 8v48z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Cloud AI */}
      <div className="bg-white border-2 border-kdc-primary mb-4 relative">
        <div className="absolute -top-3 left-5 bg-white px-2 text-kdc-body font-semibold text-kdc-primary">Cloud AI 加值服務</div>
        <div className="flex border-b border-kdc-border mt-2">
          <div className="bg-[#e3f0fd] px-4 py-2.5 text-kdc-body flex items-center justify-end min-w-[160px] max-w-[160px] text-right text-kdc-text whitespace-nowrap">Cloud AI 啟用 :</div>
          <div className={valCls}>
            <Toggle checked={f.cloudAiEnabled} onChange={v => u("cloudAiEnabled", v)} />
            <span className={`text-kdc-body ${f.cloudAiEnabled ? 'text-kdc-primary' : 'text-[#999]'}`}>{f.cloudAiEnabled ? "啟用" : "不啟用"}</span>
          </div>
        </div>
        {f.cloudAiEnabled && (
          <div className="flex">
            <div className="bg-[#e3f0fd] px-4 py-2.5 text-kdc-body flex items-center justify-end min-w-[160px] max-w-[160px] text-right text-kdc-text whitespace-nowrap"><span className="text-kdc-required mr-0.5">*</span>AI Plan :</div>
            <div className={valCls}>
              <select
                className={`${selectCls} w-[420px]`}
                value={f.cloudAiPlan}
                onChange={e => u("cloudAiPlan", e.target.value)}
                disabled={!!aiPlanGuard}
              >
                <option value="">{aiPlanGuard ? `— ${aiPlanGuard} —` : "— 請選擇 AI Plan —"}</option>
                {aiPlanOptions.map(o => (
                  <option key={o.planId} value={o.planId}>
                    {o._global ? "[共用]" : "[專屬]"} {planName(o.planId)}
                  </option>
                ))}
              </select>
              {derivedRegion && !aiPlanGuard && (
                <span className="text-[12px] text-[#666] ml-2">scope：{derivedRegion} / {derivedEnv}</span>
              )}
              {f.cloudAiPlan && (
                <span className="inline-block px-2.5 py-0.5 rounded-xl text-[13px] font-medium bg-[#e8f5e9] text-[#2e7d32] ml-2">
                  {planName(f.cloudAiPlan)} / {derivedRegion} / {derivedEnv}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Purchase & Integration */}
      <div className="mb-4">
        <div className="flex border-b border-kdc-border">
          <div className={labelCls}><span className="text-kdc-required mr-0.5">*</span>購買類型 :</div>
          <div className={valCls}>
            <label className="flex items-center gap-1"><input type="radio" name="purchaseType" checked={f.purchaseType === "new"} onChange={() => u("purchaseType", "new")} /> 首次開通/新增Realm (請續填以下對接方式)</label>
            <label className="flex items-center gap-1 ml-6"><input type="radio" name="purchaseType" checked={f.purchaseType === "addon"} onChange={() => u("purchaseType", "addon")} /> 已成功對接，本次為加購方案</label>
            {f.purchaseType === "addon" && <select className={`${selectCls} ml-2 w-[200px]`} value={f.realm} onChange={e => u("realm", e.target.value)}><option value="">請選擇Realm (必選)</option><option>tutk-realm-1</option><option>tutk-realm-2</option></select>}
          </div>
        </div>
        <div className="flex border-b border-kdc-border">
          <div className={labelCls}><span className="text-kdc-required mr-0.5">*</span>對接方式 :</div>
          <div className={valCls}>
            <label className="flex items-center gap-1"><input type="checkbox" checked={f.serverToServer} onChange={e => u("serverToServer", e.target.checked)} /> 透過第三方服務器使用vsaas服務 「Server to Server」</label>
          </div>
        </div>
        {[
          ["AM 網址", "amUrl", "authURL", "authUrl"],
          ["RefreshURL", "refreshUrl", "tokenURL", "tokenUrl"],
          ["UserInfoURL", "userInfoUrl", "LogoutURL", "logoutUrl"],
          ["ClientID", "clientId", "ClientSecret", "clientSecret"],
        ].map(([l1, k1, l2, k2]) => (
          <div key={k1} className="flex border-b border-kdc-border last:border-b-0">
            <div className={labelCls}>{l1} :</div>
            <div className={`${valCls} flex-1`}><input className={`${inputCls} w-full`} value={f[k1] || ""} onChange={e => u(k1, e.target.value)} /></div>
            <div className={labelCls}>{l2} :</div>
            <div className={`${valCls} flex-1`}><input className={`${inputCls} w-full`} value={f[k2] || ""} onChange={e => u(k2, e.target.value)} /></div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-[5px] mt-6">
        <button className="w-[120px] h-[35px] rounded-btn bg-kdc-primary-alt text-white text-kdc-btn cursor-pointer hover:opacity-85">暫存</button>
        <button className="w-[120px] h-[35px] rounded-btn bg-kdc-primary-alt text-white text-kdc-btn cursor-pointer hover:opacity-85">送出</button>
      </div>
    </div>
  );
}
