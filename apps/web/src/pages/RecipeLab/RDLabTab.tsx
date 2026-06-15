import { useState } from 'react';
import type { LabData } from '../../../../api/src/services/lab/lab.types';
import type { Recipe } from '../../../../api/src/services/recipes/recipes.types';
import {
  useUpdateVariant,
  useDeleteAttempt,
  useDeletePin,
  useCreatePin,
} from '../../hooks';
import VariantSwitcher from './components/VariantSwitcher';
import VariantBar from './components/VariantBar';
import PinnedRecipePane from './components/PinnedRecipePane';
import AttemptLog from './components/AttemptLog';
import LogAttemptModal from './components/LogAttemptModal';
import NewVariantModal from './components/NewVariantModal';

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

  const { mutate: updateVariant } = useUpdateVariant(recipeId);
  const { mutate: deleteAttempt } = useDeleteAttempt(recipeId);
  const { mutate: deletePin } = useDeletePin(recipeId);
  const { mutate: createPin } = useCreatePin(recipeId);

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
            updateVariant({ variantId: selectedVariant.id, body: { delta: delta || null } })
          }
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
          onClose={() => setShowNewVariant(false)}
          onSuccess={(variant) => setSelectedVariantId(variant.id)}
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
    </div>
  );
};

export default RDLabTab;
