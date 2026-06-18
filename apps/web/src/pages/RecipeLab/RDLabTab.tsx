import { useState } from 'react';
import type { LabData } from 'shared';
import type { Recipe } from 'shared';
import {
  useUpdateVariant,
  useDeleteAttempt,
  useDeletePin,
  useCreatePin,
  useDeleteVariant,
} from '../../hooks';
import VariantSwitcher from './components/VariantSwitcher';
import VariantBar from './components/VariantBar';
import PinnedRecipePane from './components/PinnedRecipePane';
import AttemptLog from './components/AttemptLog';
import LogAttemptModal from './components/LogAttemptModal';
import NewVariantModal from './components/NewVariantModal';
import DeleteModal from '../../components/DeleteModal';

type RDLabTabProps = {
  recipeId: string;
  recipe: Recipe;
  labData: LabData;
};

const NOTE_COLORS = ['#FEFCE8', '#F0FDF4', '#EFF6FF', '#FDF4FF', '#FFF7ED'];
const randomNoteStyle = () => ({
  color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
  rotation: parseFloat((Math.random() * 6 - 3).toFixed(1)),
});

const RDLabTab = ({ recipeId, recipe, labData }: RDLabTabProps) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    labData.variants.find((v) => v.isBest)?.id ?? labData.variants[0]?.id ?? null
  );
  const [showNewVariant, setShowNewVariant] = useState(false);
  const [showLogAttempt, setShowLogAttempt] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { mutate: updateVariant } = useUpdateVariant(recipeId);
  const { mutate: deleteAttempt } = useDeleteAttempt(recipeId);
  const { mutate: deletePin } = useDeletePin(recipeId);
  const { mutate: createPin } = useCreatePin(recipeId);
  const { mutate: deleteVariant } = useDeleteVariant(recipeId);

  const selectedVariant =
    labData.variants.find((v) => v.id === selectedVariantId) ?? null;

  const handleMarkBest = () => {
    if (!selectedVariantId) return;
    labData.variants.forEach((v) => {
      if (v.id === selectedVariantId) {
        updateVariant({ variantId: v.id, body: { isBest: true } });
      } else if (v.isBest) {
        updateVariant({ variantId: v.id, body: { isBest: false } });
      }
    });
  };

  const handleClearBest = () => {
    if (!selectedVariantId) return;
    updateVariant({ variantId: selectedVariantId, body: { isBest: false } });
  };

  const handleDelete = () => {
    if (!selectedVariantId) return;
    const index = labData.variants.findIndex((v) => v.id === selectedVariantId);
    const remaining = labData.variants.filter((v) => v.id !== selectedVariantId);
    const nextIndex = Math.min(index, remaining.length - 1);
    deleteVariant(selectedVariantId);
    setSelectedVariantId(remaining[nextIndex]?.id ?? null);
    setShowDeleteModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <VariantSwitcher
        variants={labData.variants}
        selectedVariantId={selectedVariantId}
        onSelect={setSelectedVariantId}
        onNew={() => setShowNewVariant(true)}
      />
      {selectedVariant && (
        <VariantBar
          variant={selectedVariant}
          onMarkBest={handleMarkBest}
          onClearBest={handleClearBest}
          onUpdateDelta={(delta) =>
            updateVariant({
              variantId: selectedVariant.id,
              body: { delta: delta || null },
            })
          }
          onDelete={() => setShowDeleteModal(true)}
        />
      )}
      <div className="flex items-start gap-6 flex-wrap lg:flex-nowrap">
        <div className="flex-1 min-w-[360px]">
          <PinnedRecipePane
            baseIngredients={recipe.ingredients ?? []}
            baseSteps={recipe.steps ?? []}
            variant={selectedVariant}
            pins={labData.pins}
            onDeletePin={(pinId) => deletePin(pinId)}
            onAddPin={(attachType, attachMatch, text) =>
              createPin({ attachType, attachMatch, text, ...randomNoteStyle() })
            }
            onAddGeneralNote={(text) => createPin({ text, ...randomNoteStyle() })}
          />
        </div>
        <div className="w-80 flex-shrink-0">
          <AttemptLog
            attempts={labData.attempts}
            variants={labData.variants}
            onLogAttempt={() => setShowLogAttempt(true)}
            onDeleteAttempt={(id) => deleteAttempt(id)}
          />
        </div>
      </div>
      {showNewVariant && (
        <NewVariantModal
          recipeId={recipeId}
          recipe={recipe}
          onCreated={(variantId) => setSelectedVariantId(variantId)}
          onClose={() => setShowNewVariant(false)}
        />
      )}
      {showLogAttempt && (
        <LogAttemptModal
          recipeId={recipeId}
          variants={labData.variants}
          selectedVariantId={selectedVariantId}
          onClose={() => setShowLogAttempt(false)}
        />
      )}
      {showDeleteModal && selectedVariant && (
        <DeleteModal
          title={selectedVariant.name}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default RDLabTab;
