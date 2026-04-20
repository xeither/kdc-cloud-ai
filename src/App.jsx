import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CloudAiProvider } from './context/CloudAiContext';
import KdcShell from './layouts/KdcShell';
import CloudAiSettings from './pages/CloudAiSettings/CloudAiSettings';
import ApplicationList from './pages/Applications/ApplicationList';
import ApplicationNewCategory from './pages/Applications/ApplicationNewCategory';
import VsaasApplicationForm from './pages/VsaasApplication/VsaasApplicationForm';

export default function App() {
  return (
    <CloudAiProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<KdcShell />}>
            <Route index element={<Navigate to="/cloud-ai" />} />
            <Route path="cloud-ai" element={<CloudAiSettings />} />
            <Route path="applications" element={<ApplicationList />} />
            <Route path="applications/new" element={<ApplicationNewCategory />} />
            <Route path="applications/new/vsaas" element={<VsaasApplicationForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CloudAiProvider>
  );
}
