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
import EditAttemptModal from './components/EditAttemptModal';
import NewVariantModal from './components/NewVariantModal';
import EditVariantModal from './components/EditVariantModal';
import DeleteModal from '../../components/DeleteModal';
import { formatShortDate } from '../../utils/formatDate';

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
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [showLogAttempt, setShowLogAttempt] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingAttemptId, setEditingAttemptId] = useState<string | null>(null);
  const [deletingAttemptId, setDeletingAttemptId] = useState<string | null>(null);

  const { mutate: updateVariant } = useUpdateVariant(recipeId);
  const { mutate: deleteAttempt } = useDeleteAttempt(recipeId);
  const { mutate: deletePin } = useDeletePin(recipeId);
  const { mutate: createPin } = useCreatePin(recipeId);
  const { mutate: deleteVariant } = useDeleteVariant(recipeId);

  const selectedVariant =
    labData.variants.find((v) => v.id === selectedVariantId) ?? null;

  const editingVariant = labData.variants.find((v) => v.id === editingVariantId) ?? null;

  const editingAttempt = labData.attempts.find((a) => a.id === editingAttemptId) ?? null;
  const deletingAttempt =
    labData.attempts.find((a) => a.id === deletingAttemptId) ?? null;

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
          onEdit={() => setEditingVariantId(selectedVariant.id)}
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
            onAddPin={(itemId, text) =>
              selectedVariant &&
              createPin({
                variantId: selectedVariant.id,
                itemId,
                text,
                ...randomNoteStyle(),
              })
            }
            onAddGeneralNote={(text) =>
              selectedVariant &&
              createPin({ variantId: selectedVariant.id, text, ...randomNoteStyle() })
            }
          />
        </div>
        <div className="w-80 flex-shrink-0">
          <AttemptLog
            attempts={labData.attempts}
            variants={labData.variants}
            onLogAttempt={() => setShowLogAttempt(true)}
            onEditAttempt={(id) => setEditingAttemptId(id)}
            onDeleteAttempt={(id) => setDeletingAttemptId(id)}
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
      {editingVariant && (
        <EditVariantModal
          recipeId={recipeId}
          variant={editingVariant}
          onClose={() => setEditingVariantId(null)}
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
      {editingAttempt && (
        <EditAttemptModal
          recipeId={recipeId}
          attempt={editingAttempt}
          variants={labData.variants}
          onClose={() => setEditingAttemptId(null)}
        />
      )}
      {deletingAttempt && (
        <DeleteModal
          title={`${formatShortDate(String(deletingAttempt.date))} attempt`}
          onClose={() => setDeletingAttemptId(null)}
          onConfirm={() => {
            deleteAttempt(deletingAttempt.id);
            setDeletingAttemptId(null);
          }}
        />
      )}
    </div>
  );
};

export default RDLabTab;
