import { IconClose } from '../icons';

export default function Modal({ title, children, footer, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-lg min-w-[520px] max-w-[700px] max-h-[80vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.2)]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-kdc-border text-lg font-medium text-kdc-primary">
          <span>{title}</span>
          <button className="bg-transparent border-none cursor-pointer text-kdc-text flex items-center" onClick={onClose}><IconClose /></button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-kdc-border flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
