export type RecipeFormValues = {
    title: string;
    url: string;
    notes: string;
    rating: number;
    remake: boolean;
    tags: string[];
    ingredients: { ingredient: string }[];
    steps: { step: string }[];
};
