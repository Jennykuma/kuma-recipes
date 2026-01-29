type NotesSectionProps = {
    notes?: string | null;
};

const NotesSection = ({ notes }: NotesSectionProps) => {
    return (
        <div className="flex flex-col w-full min-w-0">
            <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-sage-50 rounded-full">
                Notes
            </span>
            <textarea
                className="flex-1 min-w-0 p-2 rounded-md text-xs resize-none border border-gray-200 rounded-sm placeholder:text-xs"
                rows={4}
                value={notes ?? ''}
                readOnly
            ></textarea>
        </div>
    );
};

export default NotesSection;
