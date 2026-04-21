import { useState } from 'react';
import { useCloudAi } from '../../context/CloudAiContext';
import { IconCalendar } from '../../icons';
import Toggle from '../../components/Toggle';

export default function VsaasApplicationForm() {
  const { aiPlans, globalPlans, vendors, vendorSettings } = useCloudAi();
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [vendorInput, setVendorInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [f, setF] = useState({
    vendorId: "", salesPerson: "",
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
  const toggleRegion = (r) => {
    const cur = f.region;
    u("region", cur.includes(r) ? cur.filter(x => x !== r) : [...cur, r]);
  };
  const planName = (id) => aiPlans.find(p => p.id === id)?.name || id;

  // Autocomplete: filter vendors by VID or name as user types
  const filteredVendors = vendorInput.trim() === ""
    ? vendors
    : vendors.filter(v =>
        v.vid.toLowerCase().includes(vendorInput.toLowerCase()) ||
        v.name.toLowerCase().includes(vendorInput.toLowerCase())
      );

  const handleVendorInputChange = (val) => {
    setVendorInput(val);
    setShowSuggestions(true);
    // If typed value no longer matches the selected vendor's display string, clear selection
    if (selectedVendorId) {
      const sel = vendors.find(v => v.id === selectedVendorId);
      if (sel && val !== `${sel.vid} ${sel.name}`) {
        setSelectedVendorId("");
        u("vendorId", "");
        u("cloudAiPlan", "");
      }
    }
  };

  const selectVendor = (vendor) => {
    setVendorInput(`${vendor.vid} ${vendor.name}`);
    setSelectedVendorId(vendor.id);
    u("vendorId", vendor.id);
    u("cloudAiPlan", "");
    setShowSuggestions(false);
  };

  // Available AI Plans for selected vendor = global + vendor-specific
  const vs = vendorSettings[selectedVendorId] || { specificPlans: [], defaultPlan: "" };
  const vendorAvailablePlans = [...globalPlans, ...(vs.specificPlans || [])];

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
                value={vendorInput}
                onChange={e => handleVendorInputChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="輸入 VID 或客戶名稱"
              />
              {showSuggestions && filteredVendors.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-[360px] bg-white border border-kdc-border rounded-[5px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                  {filteredVendors.map(v => (
                    <div
                      key={v.id}
                      className="px-3 py-2 cursor-pointer hover:bg-[#e8f0f8] text-kdc-body flex items-center gap-3"
                      onMouseDown={() => selectVendor(v)}
                    >
                      <span className="text-[#666] font-mono text-[13px]">{v.vid}</span>
                      <span>{v.name}</span>
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
            <label className="flex items-center gap-1"><input type="radio" name="serviceType" checked={f.serviceType === "test"} onChange={() => u("serviceType", "test")} /> 測試</label>
            <label className="flex items-center gap-1"><input type="radio" name="serviceType" checked={f.serviceType === "formal"} onChange={() => u("serviceType", "formal")} /> 正式</label>
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
            <span className={`text-kdc-body ${f.cloudAiEnabled ? 'text-kdc-primary' : 'text-[#999]'}`}>{f.cloudAiEnabled ? "已啟用" : "未啟用"}</span>
          </div>
        </div>
        {f.cloudAiEnabled && (
          <div className="flex">
            <div className="bg-[#e3f0fd] px-4 py-2.5 text-kdc-body flex items-center justify-end min-w-[160px] max-w-[160px] text-right text-kdc-text whitespace-nowrap"><span className="text-kdc-required mr-0.5">*</span>AI Plan :</div>
            <div className={valCls}>
              <select className={`${selectCls} w-[300px]`} value={f.cloudAiPlan} onChange={e => u("cloudAiPlan", e.target.value)} disabled={!selectedVendorId}>
                <option value="">{selectedVendorId ? "— 請選擇 AI Plan —" : "— 請先選擇客戶 —"}</option>
                {globalPlans.map(planId => <option key={planId} value={planId}>[共用] {planName(planId)}</option>)}
                {(vs.specificPlans || []).map(planId => <option key={planId} value={planId}>[專屬] {planName(planId)}</option>)}
              </select>
              {f.cloudAiPlan && <span className="inline-block px-2.5 py-0.5 rounded-xl text-[13px] font-medium bg-[#e8f5e9] text-[#2e7d32] ml-2">{planName(f.cloudAiPlan)}</span>}
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
