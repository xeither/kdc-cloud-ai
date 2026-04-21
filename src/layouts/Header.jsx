import { IconHamburger, IconLogout } from '../icons';

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] h-header bg-white flex items-center justify-between px-5 border-b border-[#e0e0e0] bg-no-repeat"
      style={{ backgroundImage: 'url(/header-decoration.png)', backgroundPosition: '100% 100%' }}
    >
      <div className="flex items-center gap-3">
        <span className="cursor-pointer text-kdc-text flex items-center"><IconHamburger /></span>
        <img src="/tutk-logo.png" alt="TUTK" className="h-[47px]" />
        <span className="text-[23px] font-semibold text-kdc-text ml-[10px]">KDC Internal</span>
      </div>
      <div className="flex items-center gap-[20px] text-kdc-text pr-[130px]">
        <span className="text-[18px] font-normal">kmp_admin@tutk.com</span>
        <span className="cursor-pointer text-kdc-text flex items-center"><IconLogout /></span>
      </div>
    </header>
  );
}
