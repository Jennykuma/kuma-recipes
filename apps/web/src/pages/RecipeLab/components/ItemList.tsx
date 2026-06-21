import { useRef } from 'react';
import { CircleMinus } from 'lucide-react';
import type { VariantItem } from 'shared';

export type ItemStatus = VariantItem['status'];

const STATUS_CYCLE: ItemStatus[] = ['original', 'tweaked', 'new'];

const STATUS_CLASS: Record<ItemStatus, string> = {
  original: 'bg-gray-100 text-gray-500',
  tweaked: 'bg-amber-100 text-amber-700',
  new: 'bg-green-100 text-green-700',
};

const cycleStatus = (items: VariantItem[], idx: number): VariantItem[] => {
  const currentIdx = STATUS_CYCLE.indexOf(items[idx].status);
  const next = STATUS_CYCLE[(currentIdx + 1) % STATUS_CYCLE.length];
  return items.map((it, i) => (i === idx ? { ...it, status: next } : it));
};

const insertAt = <T,>(arr: T[], idx: number, item: T): T[] => [
  ...arr.slice(0, idx + 1),
  item,
  ...arr.slice(idx + 1),
];

const removeAt = <T,>(arr: T[], idx: number): T[] => arr.filter((_, i) => i !== idx);

type ItemListProps = {
  items: VariantItem[];
  onChange: (items: VariantItem[]) => void;
  ordered?: boolean;
};

const ItemList = ({ items, onChange, ordered }: ItemListProps) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const Tag = ordered ? 'ol' : 'ul';
  const isAddDisabled = (items[items.length - 1]?.text ?? '').trim() === '';

  return (
    <Tag className="mt-2 flex flex-col gap-1.5">
      {items.map((item, idx) => (
        <li
          key={idx}
          className={`flex gap-2 ${ordered ? 'items-start' : 'items-center'}`}
        >
          {ordered && (
            <span className="w-4 shrink-0 pt-2 text-right text-xs tabular-nums text-gray-500">
              {idx + 1}.
            </span>
          )}
          <button
            type="button"
            onClick={() => onChange(cycleStatus(items, idx))}
            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium transition ${STATUS_CLASS[item.status]} ${ordered ? 'mt-1' : ''}`}
            aria-label={`Status: ${item.status}. Click to change`}
          >
            {item.status}
          </button>
          <input
            ref={(el) => {
              refs.current[idx] = el;
            }}
            type="text"
            value={item.text}
            onChange={(e) =>
              onChange(
                items.map((it, i) => (i === idx ? { ...it, text: e.target.value } : it))
              )
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' && item.text.trim()) {
                e.preventDefault();
                onChange(insertAt(items, idx, { text: '', status: 'new' }));
                requestAnimationFrame(() => refs.current[idx + 1]?.focus());
              }
              if (e.key === 'Backspace' && item.text === '' && items.length > 1) {
                e.preventDefault();
                onChange(removeAt(items, idx));
                requestAnimationFrame(() => refs.current[Math.max(0, idx - 1)]?.focus());
              }
            }}
            className="min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs dark:border-gray-700 dark:bg-canvas-deep dark:text-gray-100 focus:border-sage-300 focus:outline-none"
          />
          {items.length > 1 && (
            <button
              type="button"
              aria-label="Remove item"
              onClick={() => onChange(removeAt(items, idx))}
              className={ordered ? 'mt-1.5' : undefined}
            >
              <CircleMinus
                className="h-4 w-4 text-red-300 opacity-80 hover:text-red-500 hover:opacity-100"
                aria-hidden="true"
              />
            </button>
          )}
        </li>
      ))}
      <button
        type="button"
        onClick={() => {
          if (isAddDisabled) return;
          onChange([...items, { text: '', status: 'new' }]);
        }}
        disabled={isAddDisabled}
        className="mt-2 rounded-full px-2.5 py-1.5 text-xs text-sage-400 transition hover:bg-sage-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
      >
        + Add {ordered ? 'step' : 'ingredient'}
      </button>
    </Tag>
  );
};

export default ItemList;
