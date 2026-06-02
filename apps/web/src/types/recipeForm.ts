export type RecipeFormValues = {
    title: string;
    source: string;
    notes: string;
    rating: number;
    yield: string;
    tagIds: string[];
    ingredients: { ingredient: string }[];
    steps: { step: string }[];
    photo?: FileList;
};
