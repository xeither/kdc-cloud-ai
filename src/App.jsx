import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CloudAiProvider } from './context/CloudAiContext';
import { P2pTraceProvider } from './context/P2pTraceContext';
import KdcShell from './layouts/KdcShell';
import CloudAiSettings from './pages/CloudAiSettings/CloudAiSettings';
import ApplicationList from './pages/Applications/ApplicationList';
import ApplicationNewCategory from './pages/Applications/ApplicationNewCategory';
import VsaasApplicationForm from './pages/VsaasApplication/VsaasApplicationForm';
import DesignSystem from './pages/DesignSystem/DesignSystem';
import CustomerList from './pages/Customers/CustomerList';
import CustomerDetail from './pages/Customers/CustomerDetail';

export default function App() {
  return (
    <CloudAiProvider>
      <P2pTraceProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<KdcShell />}>
              <Route index element={<Navigate to="/cloud-ai" />} />
              <Route path="cloud-ai" element={<CloudAiSettings />} />
              <Route path="customers" element={<CustomerList />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="applications" element={<ApplicationList />} />
              <Route path="applications/new" element={<ApplicationNewCategory />} />
              <Route path="applications/new/vsaas" element={<VsaasApplicationForm />} />
              <Route path="design-system" element={<DesignSystem />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </P2pTraceProvider>
    </CloudAiProvider>
  );
}
