import { useEffect, useRef } from 'react';
import { Pencil } from 'lucide-react';

type EditableTitleProps = {
    title?: string;
    isEditing: boolean;
    draftValue?: string;
    onEdit: () => void;
    onChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
};

const EditableTitle = ({
    title,
    isEditing,
    draftValue,
    onEdit,
    onChange,
    onSave,
    onCancel,
}: EditableTitleProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isEditing) return;
        inputRef.current?.focus();
        inputRef.current?.select();
    }, [isEditing]);

    if (isEditing) {
        return (
            <span className="flex w-full items-baseline gap-2">
                <input
                    ref={inputRef}
                    className="text-lg w-full max-w-125 font-bold border-b border-gray-300 bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300 focus-visible:ring-offset-1 rounded-sm"
                    value={draftValue ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            onSave();
                        }
                        if (event.key === 'Escape') {
                            event.preventDefault();
                            onCancel();
                        }
                    }}
                />
                <button
                    className="font-jua text-xs text-blush-400 hover:text-blush-500 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300 rounded-sm"
                    onClick={onSave}
                >
                    Save
                </button>
                <button
                    className="font-jua text-xs text-gray-400 hover:text-gray-500 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 rounded-sm"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </span>
        );
    }

    return (
        <span className="flex w-full items-baseline gap-1">
            <h1 className="text-lg font-bold">{title}</h1>
            <button
                type="button"
                onClick={onEdit}
                aria-label="Edit title"
                className="inline-flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300"
            >
                <Pencil className="w-3 h-4 pt-1 cursor-pointer link-blush" aria-hidden="true" />
            </button>
        </span>
    );
};

export default EditableTitle;
