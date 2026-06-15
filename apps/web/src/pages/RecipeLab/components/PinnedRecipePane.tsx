import { useState } from 'react';
import type { LabVariant, LabPin } from '../../../../../api/src/services/lab/lab.types';
import type { VariantItem } from '../labTypes';
import StickyNote from './StickyNote';

type PinnedRecipePaneProps = {
  baseIngredients: string[];
  baseSteps: string[];
  variant: LabVariant | null;
  pins: LabPin[];
  onDeletePin: (pinId: string) => void;
  onAddPin?: (
    attachType: 'ingredient' | 'step',
    attachMatch: string,
    text: string
  ) => void;
  onAddGeneralNote?: (text: string) => void;
};

type PendingPin = { type: 'ingredient' | 'step'; match: string };

const StatusChip = ({ status }: { status: 'tweaked' | 'new' }) => (
  <span
    className={`ml-1.5 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${
      status === 'tweaked'
        ? 'border-amber-200 bg-amber-50 text-amber-600'
        : 'border-sage-200 bg-sage-100 text-primary'
    }`}
  >
    {status}
  </span>
);

const PinButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="pt-0.5 text-sm font-semibold text-blush-200 transition-colors hover:text-accent"
  >
    + pin a note
  </button>
);

const InlineNoteEditor = ({
  onSave,
  onCancel,
}: {
  onSave: (text: string) => void;
  onCancel: () => void;
}) => {
  const [text, setText] = useState('');
  return (
    <div className="w-52 min-h-20 rounded-xl border border-gray-200 bg-white p-3 shadow-sm flex flex-col gap-2">
      <textarea
        autoFocus
        className="w-full flex-1 resize-none outline-none text-sm leading-snug text-gray-800"
        placeholder="Add a note…"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onCancel();
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && text.trim())
            onSave(text.trim());
        }}
        onBlur={() => {
          if (text.trim()) onSave(text.trim());
          else onCancel();
        }}
      />
    </div>
  );
};

type PinnedSectionProps = {
  label: string;
  type: 'ingredient' | 'step';
  items: VariantItem[];
  pins: LabPin[];
  pendingPin: PendingPin | null;
  onPinClick: (type: 'ingredient' | 'step', match: string) => void;
  onCancelPin: () => void;
  onAddPin?: (type: 'ingredient' | 'step', match: string, text: string) => void;
  onDeletePin: (pinId: string) => void;
};

const PinnedSection = ({
  label,
  type,
  items,
  pins,
  pendingPin,
  onPinClick,
  onCancelPin,
  onAddPin,
  onDeletePin,
}: PinnedSectionProps) => {
  const findPin = (text: string) =>
    pins.find(
      (p) =>
        p.attachType === type &&
        p.attachMatch &&
        text.toLowerCase().includes(p.attachMatch.toLowerCase())
    );

  const isPending = (match: string) =>
    pendingPin?.type === type && pendingPin.match === match;

  return (
    <div>
      <p className="mb-3 text-xs font-bold tracking-widest text-gray-400">{label}</p>
      <div>
        {items.map((item, idx) => {
          const pin = findPin(item.text);
          return (
            <div
              key={idx}
              className={`flex items-start gap-4 py-2 ${type === 'ingredient' ? 'border-b border-gray-50 last:border-0' : ''}`}
            >
              <div
                className={`flex min-w-0 flex-1 gap-2 ${type === 'ingredient' ? 'flex-wrap items-center' : 'items-start'}`}
              >
                {type === 'step' && (
                  <span className="flex-shrink-0 font-bold leading-relaxed text-accent">
                    {idx + 1}
                  </span>
                )}
                <div
                  className={`flex min-w-0 flex-wrap gap-2 ${type === 'step' ? 'items-start self-center' : 'items-center'}`}
                >
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {type === 'ingredient' ? `• ${item.text}` : item.text}
                  </span>
                  {item.status !== 'original' && <StatusChip status={item.status} />}
                </div>
              </div>
              <div className="w-52 flex-shrink-0">
                {pin ? (
                  <StickyNote
                    text={pin.text}
                    color={pin.color}
                    rotation={pin.rotation}
                    onRemove={() => onDeletePin(pin.id)}
                  />
                ) : isPending(item.text) ? (
                  <InlineNoteEditor
                    onSave={(text) => {
                      onAddPin?.(type, item.text, text);
                      onCancelPin();
                    }}
                    onCancel={onCancelPin}
                  />
                ) : (
                  <PinButton onClick={() => onPinClick(type, item.text)} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PinnedRecipePane = ({
  baseIngredients,
  baseSteps,
  variant,
  pins,
  onDeletePin,
  onAddPin,
  onAddGeneralNote,
}: PinnedRecipePaneProps) => {
  const [pendingPin, setPendingPin] = useState<PendingPin | null>(null);
  const [addingGeneralNote, setAddingGeneralNote] = useState(false);

  const ingredients: VariantItem[] = variant
    ? ((variant.ingredients as VariantItem[] | null) ?? [])
    : baseIngredients.map((text) => ({ text, status: 'original' }));

  const steps: VariantItem[] = variant
    ? ((variant.steps as VariantItem[] | null) ?? [])
    : baseSteps.map((text) => ({ text, status: 'original' }));

  const generalPins = pins.filter((p) => !p.attachType);

  return (
    <div className="flex flex-col gap-6">
      <PinnedSection
        label="INGREDIENTS"
        type="ingredient"
        items={ingredients}
        pins={pins}
        pendingPin={pendingPin}
        onPinClick={(type, match) => setPendingPin({ type, match })}
        onCancelPin={() => setPendingPin(null)}
        onAddPin={onAddPin}
        onDeletePin={onDeletePin}
      />
      <PinnedSection
        label="STEPS"
        type="step"
        items={steps}
        pins={pins}
        pendingPin={pendingPin}
        onPinClick={(type, match) => setPendingPin({ type, match })}
        onCancelPin={() => setPendingPin(null)}
        onAddPin={onAddPin}
        onDeletePin={onDeletePin}
      />

      {/* General notes shelf */}
      <div>
        <p className="mb-3 text-xs font-bold tracking-widest text-gray-400">
          GENERAL NOTES
        </p>
        <div className="flex flex-wrap gap-3 items-start">
          {generalPins.map((pin) => (
            <StickyNote
              key={pin.id}
              text={pin.text}
              color={pin.color}
              rotation={pin.rotation}
              showPinnedLabel={false}
              onRemove={() => onDeletePin(pin.id)}
            />
          ))}
          {addingGeneralNote ? (
            <InlineNoteEditor
              onSave={(text) => {
                onAddGeneralNote?.(text);
                setAddingGeneralNote(false);
              }}
              onCancel={() => setAddingGeneralNote(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setAddingGeneralNote(true)}
              className="w-36 min-h-20 rounded-xl border-2 border-dashed border-gray-200 p-3 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors flex items-center justify-center"
            >
              + Add a note
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinnedRecipePane;
