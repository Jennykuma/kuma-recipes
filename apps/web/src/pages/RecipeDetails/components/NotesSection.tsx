type NotesSectionProps = {
    notes?: string | null;
    isEditing: boolean;
    draftValue?: string;
    onEdit: () => void;
    onChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
};

const NotesSection = ({
    notes,
    isEditing,
    draftValue,
    onEdit,
    onChange,
    onSave,
    onCancel,
}: NotesSectionProps) => {
    if (isEditing) {
        return (
            <div className="flex flex-col w-full max-w-150">
                <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-sage-50 rounded-full">
                    Notes
                </span>
                <textarea
                    className="flex-1 min-w-0 p-2 rounded-md text-xs resize-none border border-gray-200 rounded-sm placeholder:text-xs"
                    rows={4}
                    value={draftValue ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onSave}
                ></textarea>
                {isEditing && (
                    <div className="mt-3 flex gap-2 justify-end">
                        <button
                            className="text-xs text-gray-400"
                            type="button"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="text-xs text-blush-400"
                            type="submit"
                        >
                            Save
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full max-w-150">
            <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-sage-50 rounded-full">
                Notes
            </span>
            <textarea
                className="flex-1 min-w-0 p-2 rounded-md text-xs resize-none border border-gray-200 rounded-sm placeholder:text-xs"
                rows={4}
                value={notes ?? ''}
                onClick={onEdit}
                onFocus={onEdit}
                readOnly
            ></textarea>
        </div>
    );
};

export default NotesSection;
