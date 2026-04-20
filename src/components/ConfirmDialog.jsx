import Modal from './Modal';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Modal title="確認" onClose={onCancel} footer={
      <>
        <button className="px-3.5 py-1.5 text-sm rounded-btn border border-kdc-primary bg-white text-kdc-primary cursor-pointer hover:opacity-85" onClick={onCancel}>取消</button>
        <button className="px-3.5 py-1.5 text-sm rounded-btn border border-[#d32f2f] bg-[#d32f2f] text-white cursor-pointer hover:opacity-85" onClick={onConfirm}>確定刪除</button>
      </>
    }>
      <p className="text-[15px]">{message}</p>
    </Modal>
  );
}
