import Modal from './Modal';

export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  title = "確認",
  confirmText = "確定刪除",
  cancelText = "取消",
  variant = "danger",
  singleButton = false,
}) {
  const confirmClass = variant === "warning"
    ? "border-kdc-primary bg-kdc-primary-alt text-white"
    : "border-[#d32f2f] bg-[#d32f2f] text-white";

  return (
    <Modal title={title} onClose={onCancel} footer={
      <>
        {!singleButton && (
          <button
            className="px-3.5 py-1.5 text-sm rounded-btn border border-kdc-primary bg-white text-kdc-primary cursor-pointer hover:opacity-85"
            onClick={onCancel}
          >
            {cancelText}
          </button>
        )}
        <button
          className={`px-3.5 py-1.5 text-sm rounded-btn border cursor-pointer hover:opacity-85 ${confirmClass}`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </>
    }>
      <p className="text-[15px]">{message}</p>
    </Modal>
  );
}
