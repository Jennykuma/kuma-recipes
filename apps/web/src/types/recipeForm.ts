export type RecipeFormValues = {
    title: string;
    source: string;
    notes: string;
    rating: number;
    remake: boolean;
    yield: string;
    tagIds: string[];
    ingredients: { ingredient: string }[];
    steps: { step: string }[];
    photo?: FileList;
};
