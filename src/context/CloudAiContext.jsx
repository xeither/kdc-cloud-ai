import { createContext, useContext, useState } from 'react';
import {
  INITIAL_VLM_PROFILES,
  INITIAL_PROMPTS,
  INITIAL_AI_PLANS,
  INITIAL_GLOBAL_PLANS,
} from '../data/mockData';
import { INITIAL_CUSTOMERS, INITIAL_CUSTOMER_CLOUD_AI } from '../data/customersData';

const CloudAiContext = createContext();

export function CloudAiProvider({ children }) {
  const [vlmProfiles, setVlmProfiles] = useState(INITIAL_VLM_PROFILES);
  const [prompts, setPrompts] = useState(INITIAL_PROMPTS);
  const [aiPlans, setAiPlans] = useState(INITIAL_AI_PLANS);
  const [globalPlans, setGlobalPlans] = useState(INITIAL_GLOBAL_PLANS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [customerCloudAi, setCustomerCloudAi] = useState(INITIAL_CUSTOMER_CLOUD_AI);

  const value = {
    vlmProfiles, setVlmProfiles,
    prompts, setPrompts,
    aiPlans, setAiPlans,
    globalPlans, setGlobalPlans,
    customers, setCustomers,
    customerCloudAi, setCustomerCloudAi,
  };

  return <CloudAiContext.Provider value={value}>{children}</CloudAiContext.Provider>;
}

export const useCloudAi = () => useContext(CloudAiContext);
