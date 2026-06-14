type SaveCancelButtonsProps = {
  onSave: () => void;
  onCancel: () => void;
};

const SaveCancelButtons = ({ onSave, onCancel }: SaveCancelButtonsProps) => (
  <>
    <button
      type="button"
      className="text-xs text-gray-400 hover:text-gray-500 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 rounded-sm"
      onClick={onCancel}
    >
      Cancel
    </button>
    <button
      type="button"
      className="text-xs text-blush-400 hover:text-blush-500 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300 rounded-sm"
      onClick={onSave}
    >
      Save
    </button>
  </>
);

export default SaveCancelButtons;
