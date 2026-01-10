import React from 'react';
import Rating from './Rating';

interface RecipeCardProps {
    rating?: number;
    title: string;
}

const RecipeCard = ({ rating, title }: RecipeCardProps) => {
    return (
        <div className="flex flex-col w-96 md:w-full md:flex-row gap-4 p-4 border border-gray-200 rounded-sm shadow-sm hover:shadow-none cursor-pointer">
            <div className="flex flex-col w-full md:w-2/3 justify-center">
                <span>{title}</span>
                <Rating rating={rating} />
            </div>
            <div className="w-full md:w-32 h-32 bg-gray-100">photo</div>
        </div>
    );
};

export default RecipeCard;
