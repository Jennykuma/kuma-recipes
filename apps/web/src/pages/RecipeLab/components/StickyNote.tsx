type StickyNoteProps = {
  text: string;
  color: string;
  rotation: number;
  onRemove?: () => void;
  showPinnedLabel?: boolean;
};

const StickyNote = ({
  text,
  color,
  rotation,
  onRemove,
  showPinnedLabel = true,
}: StickyNoteProps) => {
  return (
    <div
      className="relative w-52 min-h-20 rounded-xl p-3 shadow-md"
      style={{ backgroundColor: color, transform: `rotate(${rotation}deg)` }}
    >
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove note"
          className="absolute top-1 right-2 text-sm leading-none text-gray-500/60 hover:text-gray-700"
        >
          ×
        </button>
      )}
      {showPinnedLabel && (
        <p className="mb-1 text-[11px] font-bold text-gray-400">📌 PINNED</p>
      )}
      <p className="text-sm text-gray-800 break-words leading-snug">{text}</p>
    </div>
  );
};

export default StickyNote;
