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
    if (isEditing) {
        return (
            <span className="flex w-full items-baseline gap-2">
                <input
                    className="text-lg w-full max-w-125 font-bold border-b border-gray-300 bg-transparent focus:outline-none"
                    value={draftValue ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onSave}
                />
                <button className="text-xs text-blush-400 shrink-0" onClick={onSave}>
                    Save
                </button>
                <button className="text-xs text-gray-400 shrink-0" onClick={onCancel}>
                    Cancel
                </button>
            </span>
        );
    }

    return (
        <span className="flex w-full items-baseline gap-1">
            <h1 className="text-lg font-bold">{title}</h1>
            <Pencil className="w-3 h-4 pt-1 cursor-pointer link-blush" onClick={onEdit} />
        </span>
    );
};

export default EditableTitle;
