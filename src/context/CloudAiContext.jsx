import { createContext, useContext, useState } from 'react';
import {
  INITIAL_VLM_PROFILES,
  INITIAL_PROMPTS,
  INITIAL_AI_PLANS,
  INITIAL_GLOBAL_PLANS,
  INITIAL_VENDOR_SETTINGS,
  INITIAL_VENDORS,
} from '../data/mockData';

const CloudAiContext = createContext();

export function CloudAiProvider({ children }) {
  const [vlmProfiles, setVlmProfiles] = useState(INITIAL_VLM_PROFILES);
  const [prompts, setPrompts] = useState(INITIAL_PROMPTS);
  const [aiPlans, setAiPlans] = useState(INITIAL_AI_PLANS);
  const [globalPlans, setGlobalPlans] = useState(INITIAL_GLOBAL_PLANS);
  const [vendorSettings, setVendorSettings] = useState(INITIAL_VENDOR_SETTINGS);

  const value = {
    vlmProfiles, setVlmProfiles,
    prompts, setPrompts,
    aiPlans, setAiPlans,
    globalPlans, setGlobalPlans,
    vendorSettings, setVendorSettings,
    vendors: INITIAL_VENDORS,
  };

  return <CloudAiContext.Provider value={value}>{children}</CloudAiContext.Provider>;
}

export const useCloudAi = () => useContext(CloudAiContext);
