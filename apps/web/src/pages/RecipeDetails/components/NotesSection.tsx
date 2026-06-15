import { useEffect, useRef } from 'react';
import { ScrollText } from 'lucide-react';

type NotesSectionProps = {
  notes?: string | null;
  editable?: boolean;
  isEditing?: boolean;
  draftValue?: string;
  onEdit?: () => void;
  onChange?: (value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
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
  editable = true,
  isEditing = false,
  draftValue,
  onEdit,
  onChange,
  onSave,
  onCancel,
}: NotesSectionProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.focus();
    const cursorPosition = textarea.value.length;
    textarea.setSelectionRange(cursorPosition, cursorPosition);
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className="flex h-full w-full min-w-0 flex-col">
        <span className="field-label inline-flex items-center gap-1 text-gray-500 rounded-full dark:text-gray-300">
          <ScrollText className="h-3 w-3" aria-hidden="true" />
          Notes
        </span>
        <textarea
          id="notes"
          ref={textareaRef}
          className="
            h-[180px] w-full p-2 rounded-md text-xs
            resize-none bg-white border border-gray-200
            placeholder:text-xs dark:border-gray-700 dark:bg-canvas-card dark:text-gray-100
            focus:border-sage-300 focus:outline-none"
          value={draftValue ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={() => onSave?.()}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              onCancel?.();
            }
          }}
        ></textarea>
      </div>
    );
  }

  const noteText = notes ?? '';
  const noteParts = getNoteParts(noteText);

  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <span
        className="
          field-label inline-flex items-center gap-1 text-gray-500 rounded-full dark:text-gray-300"
      >
        <ScrollText className="h-3 w-3" aria-hidden="true" />
        Notes
      </span>
      <div
        className="
          min-h-0 max-h-[200px] w-full flex-1 p-2 rounded-md text-xs
          whitespace-pre-wrap wrap-break-word bg-white border border-gray-200
          dark:border-gray-700 dark:bg-canvas-card dark:text-gray-100
          overflow-scroll"
        onClick={editable ? onEdit : undefined}
        role={editable ? 'button' : undefined}
        tabIndex={editable ? 0 : undefined}
        onKeyDown={(event) => {
          if (!editable) {
            return;
          }

          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onEdit?.();
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
