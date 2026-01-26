import { useParams } from 'react-router-dom';
import { useRecipeDetails, useRecipeRating } from '../hooks';
import Rating from '../components/Rating';
import BackButton from '../components/BackButton';

const RecipeDetails = () => {
    const { id } = useParams();
    const { recipe } = useRecipeDetails(id || '');
    const { mutate: updateRating, isPending } = useRecipeRating(id || '');

    const handleChangeRating = (rating: number) => {
        if (!recipe) {
            return;
        }

        if (recipe?.rating !== rating) {
            updateRating(rating);
        }
    };

    return (
        <div className="p-6">
            <BackButton />
            <header className="shrink-0 text-lg text-left font-bold">
                {recipe?.title}
            </header>
            <Rating
                value={recipe?.rating}
                onChange={handleChangeRating}
                interactive={!isPending}
            />
        </div>
    );
};

export default RecipeDetails;
