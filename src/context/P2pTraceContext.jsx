// ─────────────────────────────────────────────────────────────────────────
// P2pTraceContext — 獨立 context，管理 per-customer VPG trace 開通狀態。
//
// 不與 CloudAiContext 合併：兩者領域不同（CloudAi 管 AI Plan 綁定，
// P2P Trace 管 trace log 開關），未來模組擴張時保持每個 module 自有 context。
// ─────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useState } from 'react';
import { INITIAL_VPGS } from '../data/vpgData';

const P2pTraceContext = createContext();

export function P2pTraceProvider({ children }) {
  // customerId → array of VPG records
  const [vpgsByCustomer, setVpgsByCustomer] = useState(INITIAL_VPGS);

  /**
   * Toggle trace for a specific VPG under a customer.
   * 操作者由 caller 傳入（mock，正式版接 SSO）。
   */
  function setVpgTrace(customerId, vpgId, enabled, operator = "Ronald_Chen") {
    setVpgsByCustomer((prev) => {
      const list = prev[customerId] || [];
      const updated = list.map((v) =>
        v.id === vpgId
          ? {
              ...v,
              traceEnabled: enabled,
              enabledAt: enabled ? new Date().toISOString().slice(0, 10) : null,
              enabledBy: enabled ? operator : null,
            }
          : v,
      );
      return { ...prev, [customerId]: updated };
    });
  }

  function getVpgsForCustomer(customerId) {
    return vpgsByCustomer[customerId] || [];
  }

  const value = {
    vpgsByCustomer,
    setVpgsByCustomer,
    setVpgTrace,
    getVpgsForCustomer,
  };

  return <P2pTraceContext.Provider value={value}>{children}</P2pTraceContext.Provider>;
}

export const useP2pTrace = () => useContext(P2pTraceContext);
