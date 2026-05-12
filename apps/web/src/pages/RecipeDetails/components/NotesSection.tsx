type NotesSectionProps = {
    notes?: string | null;
    isEditing: boolean;
    draftValue?: string;
    onEdit: () => void;
    onChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
};

type NotePart =
    | { type: 'text'; value: string }
    | { type: 'link'; value: string; href: string };

const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
const trailingPunctuationPattern = /[.,!?;:)]$/;

function normalizeNoteLink(value: string): string | null {
    const lowerValue = value.toLowerCase();
    const withScheme =
        lowerValue.startsWith('http://') || lowerValue.startsWith('https://')
            ? value
            : `https://${value}`;

    try {
        return new URL(withScheme).href;
    } catch {
        return null;
    }
}

function getNoteParts(notes: string): NotePart[] {
    const parts: NotePart[] = [];
    let lastIndex = 0;

    for (const match of notes.matchAll(urlPattern)) {
        const matchIndex = match.index ?? 0;
        const rawValue = match[0];

        if (matchIndex > lastIndex) {
            parts.push({ type: 'text', value: notes.slice(lastIndex, matchIndex) });
        }

        let linkText = rawValue;
        let trailingText = '';

        while (trailingPunctuationPattern.test(linkText)) {
            trailingText = `${linkText.slice(-1)}${trailingText}`;
            linkText = linkText.slice(0, -1);
        }

        const href = normalizeNoteLink(linkText);

        if (href) {
            parts.push({ type: 'link', value: linkText, href });
        } else {
            parts.push({ type: 'text', value: linkText });
        }

        if (trailingText) {
            parts.push({ type: 'text', value: trailingText });
        }

        lastIndex = matchIndex + rawValue.length;
    }

    if (lastIndex < notes.length) {
        parts.push({ type: 'text', value: notes.slice(lastIndex) });
    }

    return parts;
}

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
                    rows={7}
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

    const noteText = notes ?? '';
    const noteParts = getNoteParts(noteText);

    return (
        <div className="flex flex-col w-full min-w-0">
            <span
                className="
                    text-[10px] uppercase tracking-wide
                    text-gray-500 rounded-full dark:text-gray-300"
            >
                Notes
            </span>
            <div
                className="
                    flex-1 max-w-125 min-h-[132px] p-2 rounded-md text-xs
                    whitespace-pre-wrap break-words bg-white border border-gray-200
                    rounded-sm dark:border-gray-700 dark:bg-[#2a2a2a] dark:text-gray-100"
                onClick={onEdit}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onEdit();
                    }
                }}
            >
                {noteParts.map((part, index) =>
                    part.type === 'link' ? (
                        <a
                            key={`${part.value}-${index}`}
                            href={part.href}
                            target="_blank"
                            rel="noreferrer"
                            className="link-blush text-blush-400 hover:underline"
                            onClick={(event) => event.stopPropagation()}
                        >
                            {part.value}
                        </a>
                    ) : (
                        <span key={`${part.value}-${index}`}>{part.value}</span>
                    )
                )}
            </div>
        </div>
    );
};

export default NotesSection;
