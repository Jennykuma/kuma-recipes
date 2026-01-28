import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipeDetails, useRecipeRating, useDeleteRecipe } from '../../hooks';
import Rating from '../../components/Rating';
import BackButton from '../../components/BackButton';
import DeleteModal from './components/DeleteModal';

const RecipeDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const recipeId = id ?? '';
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { recipe } = useRecipeDetails(recipeId);
    const { mutate: updateRating, isPending } = useRecipeRating(recipeId);
    const { mutate: deleteRecipe } = useDeleteRecipe(recipeId);

    const handleChangeRating = (rating: number) => {
        if (!recipe) {
            return;
        }

        if (recipe?.rating !== rating) {
            updateRating(rating);
        }
    };

    const handleDelete = () => {
        if (!recipeId) return;
        setShowDeleteModal(false);
        deleteRecipe(undefined, { onSuccess: () => navigate('/') });
    };

    return (
        <div className="p-6">
            <BackButton to="/" />
            <header className="flex items-center justify-between">
                <h1 className="shrink-0 text-lg text-left font-bold">{recipe?.title}</h1>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-xs text-white border border-blush-400 bg-blush-400 px-2.5 py-1 rounded hover:bg-blush-200 hover:text-white transition-colors"
                >
                    Delete
                </button>
            </header>
            {showDeleteModal ? (
                <DeleteModal
                    title={recipe?.title}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                />
            ) : null}
            <Rating
                value={recipe?.rating}
                onChange={handleChangeRating}
                interactive={!isPending}
            />
        </div>
    );
};

export default RecipeDetails;
