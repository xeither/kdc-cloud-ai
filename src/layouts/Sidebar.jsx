import { useLocation, useNavigate } from 'react-router-dom';
import {
  IconCustomer, IconSupplier, IconQuote, IconApplication,
  IconSearch, IconNotification, IconPublish, IconDocs,
  IconAdmin, IconSettings, IconCloudAi,
} from '../sidebar-icons';

const sidebarItems = [
  { id: "customer", label: "客戶資訊", icon: IconCustomer, disabled: true },
  { id: "supplier", label: "供應商資訊", icon: IconSupplier, disabled: true },
  { id: "quote", label: "報價資訊", icon: IconQuote, disabled: true },
  { id: "applications", label: "申請單管理", icon: IconApplication, path: "/applications" },
  { id: "search", label: "查詢中心", icon: IconSearch, disabled: true },
  { id: "notification", label: "通知中心", icon: IconNotification, disabled: true },
  { id: "publish", label: "發佈管理", icon: IconPublish, disabled: true },
  { id: "docs", label: "文件中心", icon: IconDocs, disabled: true },
  { id: "admin", label: "管理員設定", icon: IconAdmin, disabled: true },
  { id: "settings", label: "設定", icon: IconSettings, disabled: true },
  { id: "cloud-ai", label: "Cloud AI 設定", icon: IconCloudAi, path: "/cloud-ai" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (item) => {
    if (!item.path) return false;
    if (item.id === "applications") return location.pathname.startsWith("/applications");
    return location.pathname === item.path;
  };

  return (
    <nav className="kdc-sidebar fixed top-0 left-0 bottom-0 w-sidebar bg-kdc-primary pt-[80px] z-[90] overflow-y-auto">
      {sidebarItems.map(item => {
        const Icon = item.icon;
        const active = isActive(item);
        return (
          <a
            key={item.id}
            className={`flex items-center gap-3 py-3 px-[25px] text-kdc-sidebar no-underline cursor-pointer transition-colors duration-150 [&_svg]:w-5 [&_svg]:h-5
              ${active ? 'bg-kdc-sidebar-active text-kdc-primary' : 'text-white hover:bg-white/10'}
              ${item.disabled ? 'cursor-default' : ''}`}
            onClick={() => !item.disabled && item.path && navigate(item.path)}
          >
            <Icon />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
