export type RecipeFormValues = {
    title: string;
    source: string;
    notes: string;
    rating: number;
    remake: boolean;
    tags: string[];
    ingredients: { ingredient: string }[];
    steps: { step: string }[];
};
