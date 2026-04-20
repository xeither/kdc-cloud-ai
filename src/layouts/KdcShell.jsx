import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function KdcShell() {
  return (
    <div className="font-kdc text-kdc-body text-kdc-text bg-kdc-body-bg min-h-screen">
      <Header />
      <Sidebar />
      <main className="ml-[220px] mt-[82px] p-[15px] pb-[70px] min-h-[calc(100vh-82px-56px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
