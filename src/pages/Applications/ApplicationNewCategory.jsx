import { useNavigate } from 'react-router-dom';

const categories = [
  { cat: "P2P", items: [{ label: "服務啟用" }, { label: "新增頻寬服務啟用" }, { label: "Server Key / License Key 申請" }] },
  { cat: "UID", items: [{ label: "異動申請單" }, { label: "出貨申請單" }, { label: "新增VPG申請單" }] },
  { cat: "UDID", items: [{ label: "設備憑證申請單" }] },
  { cat: "KPNS", items: [{ label: "服務啟動申請單" }] },
  { cat: "KDC", items: [{ label: "帳號 / 功能申請單" }] },
  { cat: "SDK", items: [{ label: "License Key申請" }] },
  { cat: "VSaaS", items: [
    { label: "使用申請單", action: "vsaas" },
    { label: "修改申請單" },
  ]},
  { cat: "CXL", items: [{ label: "取消服務申請單" }] },
];

export default function ApplicationNewCategory() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-kdc-title font-medium text-kdc-primary mb-5">新增申請單</h2>
      <div className="flex flex-col bg-white border border-kdc-border">
        {categories.map(row => (
          <div key={row.cat} className="flex border-b border-kdc-border last:border-b-0 min-h-[56px]">
            <div className="w-[160px] flex items-center justify-center text-kdc-table font-medium text-kdc-primary border-r border-kdc-border bg-[#fafbfc]">
              {row.cat}
            </div>
            <div className="flex-1 flex items-center gap-12 px-6 py-3 flex-wrap">
              {row.items.map(item => (
                <a
                  key={item.label}
                  className={`text-[15px] no-underline py-1 ${item.action ? 'text-kdc-text cursor-pointer hover:text-kdc-primary hover:underline' : 'text-[#aaa] cursor-default'}`}
                  onClick={item.action ? () => navigate('/applications/new/vsaas') : undefined}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
