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
      <h2 className="text-kdc-title font-medium text-kdc-primary mb-[37px]">新增申請單</h2>
      <div className="space-y-2.5">
        {categories.map(row => (
          <div key={row.cat} className="bg-white rounded-[10px] h-[60px] grid grid-cols-[190px_1fr] items-center border-l-[15px] border-kdc-tab-unselected">
            <div className="text-[16px] font-bold text-kdc-primary-alt text-center border-r border-[#cccccc] h-full flex items-center justify-center">{row.cat}</div>
            <ul className="grid grid-cols-4 list-none m-0 pl-[15px]">
              {row.items.map(item => (
                <li
                  key={item.label}
                  onClick={item.action ? () => navigate('/applications/new/vsaas') : undefined}
                  className="text-[16px] font-normal text-kdc-primary-alt cursor-pointer hover:underline"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
