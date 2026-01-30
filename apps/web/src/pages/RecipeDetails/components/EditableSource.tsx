import { Pencil } from 'lucide-react';

type EditableSourceProps = {
    source?: string;
    isEditing: boolean;
    draftValue?: string;
    onEdit: () => void;
    onChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
};

const EditableSource = ({
    source,
    isEditing,
    draftValue,
    onEdit,
    onChange,
    onSave,
    onCancel,
}: EditableSourceProps) => {
    const sourceText = source?.trim() ?? '';
    const sourceLink = (() => {
        if (!sourceText) return null;
        try {
            const withScheme =
                sourceText.startsWith('http://') || sourceText.startsWith('https://')
                    ? sourceText
                    : sourceText.startsWith('www.')
                      ? `https://${sourceText}`
                      : null;
            if (!withScheme) return null;
            return new URL(withScheme).href;
        } catch {
            return null;
        }
    })();

    return (
        <span className="flex items-baseline gap-2 w-full">
            <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-sage-50 rounded-full shrink-0">
                Source
            </span>
            {isEditing ? (
                <div className="flex w-full items-baseline gap-2">
                    <input
                        className="w-full max-w-125 border-b border-gray-300 bg-transparent focus:outline-none"
                        value={draftValue ?? ''}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onSave}
                    />
                    <button
                        className="font-jua text-xs text-blush-400 hover:text-blush-500 shrink-0"
                        onClick={onSave}
                    >
                        Save
                    </button>
                    <button
                        className="font-jua text-xs text-gray-400 hover:text-gray-500 shrink-0"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <div className="inline-flex items-baseline gap-1 min-w-0 max-w-full">
                    {sourceLink ? (
                        <a
                            href={sourceLink}
                            target="_blank"
                            rel="noreferrer"
                            title={sourceLink}
                            className="link-blush text-sm text-blush-400 hover:underline truncate overflow-hidden text-ellipsis min-w-0 max-w-full"
                        >
                            {sourceText}
                        </a>
                    ) : (
                        <span className="text-sm text-gray-600 truncate overflow-hidden text-ellipsis min-w-0 max-w-full">
                            {sourceText || '—'}
                        </span>
                    )}
                    <Pencil
                        className="w-3 h-4 pt-1 cursor-pointer link-blush shrink-0"
                        onClick={onEdit}
                    />
                </div>
            )}
        </span>
    );
};

export default EditableSource;
