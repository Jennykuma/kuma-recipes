import Rating from './Rating';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
    id: string;
    rating?: number;
    title: string;
}

const RecipeCard = ({ id, rating, title }: RecipeCardProps) => {
    return (
        <Link
            role="link"
            tabIndex={0}
            className="flex flex-col w-96 md:w-full md:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm shadow-gray-100 hover:shadow-none cursor-pointer"
            to={`/recipes/${id}`}
        >
            <div className="flex flex-col w-full md:w-2/3 justify-center">
                <span>{title}</span>
                <Rating value={rating} />
            </div>
            <div className="w-full md:w-32 h-32 bg-gray-100">photo</div>
        </Link>
    );
};

export default RecipeCard;
