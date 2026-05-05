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
            <div className="flex flex-col w-full min-w-0">
                <span className="text-[10px] uppercase tracking-wide text-gray-500 rounded-full dark:text-gray-300">
                    Notes
                </span>
                <textarea
                    className="
                        flex-1 max-w-125 p-2 rounded-md text-xs
                        resize-none bg-white border border-gray-200
                        rounded-sm placeholder:text-xs dark:border-gray-700 dark:bg-[#2a2a2a] dark:text-gray-100"
                    rows={4}
                    value={draftValue ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onSave}
                ></textarea>
                {isEditing && (
                    <div className="mt-1 flex gap-2 justify-end max-w-125">
                        <button
                            className="font-jua text-xs text-gray-400 hover:text-gray-500"
                            type="button"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="font-jua text-xs text-blush-400 hover:text-blush-500"
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
        <div className="flex flex-col w-full min-w-0">
            <span
                className="
                    text-[10px] uppercase tracking-wide
                    text-gray-500 rounded-full dark:text-gray-300"
            >
                Notes
            </span>
            <textarea
                className="
                    flex-1 max-w-125 p-2 rounded-md text-xs
                    resize-none bg-white border border-gray-200
                    rounded-sm placeholder:text-xs dark:border-gray-700 dark:bg-[#2a2a2a] dark:text-gray-100"
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
