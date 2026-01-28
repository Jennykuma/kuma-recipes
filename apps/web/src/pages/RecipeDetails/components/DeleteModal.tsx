type DeleteModalProps = {
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
};

const DeleteModal = ({ onClose, onConfirm, title }: DeleteModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
            <div
                role="dialog"
                aria-modal="true"
                className="relative z-10 w-[90vw] max-w-md rounded-lg bg-white p-5 shadow-lg"
            >
                <p className="text-sm text-gray-800">
                    <strong>Delete{title ? ` “${title}”` : ''}?</strong>
                    <br />
                    This can’t be undone.
                </p>
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        className="rounded-md px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="rounded-md bg-blush-200 px-3 py-1.5 text-xs text-white hover:bg-blush-400"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
