import { createPortal } from 'react-dom';

type CancelModalProps = {
  onClose: () => void;
  onDiscard: () => void;
};

const CancelModal = ({ onClose, onDiscard }: CancelModalProps) => {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60"
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-[90vw] max-w-md rounded-lg bg-white p-5 shadow-lg"
      >
        <p className="text-sm text-gray-800">
          You have unsaved changes. If you leave now, they will be lost.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded-md px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
            onClick={() => onClose()}
          >
            Keep editing
          </button>
          <button
            className="rounded-md bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700"
            onClick={() => onDiscard()}
          >
            Discard
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CancelModal;
