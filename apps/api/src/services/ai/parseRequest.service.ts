import { parseRecipeFromUrl } from './parseRecipeFromUrl.service.js';
import { parseRecipeText, type ParsedRecipe } from './parseRecipe.service.js';

const isUrl = (input: string) => {
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
};

export type ParseRequestResult =
  | { ok: true; recipe: ParsedRecipe }
  | { ok: false; reason: 'url_no_recipe' };

export async function parseRequest(input: string): Promise<ParseRequestResult> {
  if (isUrl(input)) {
    const recipe = await parseRecipeFromUrl(input);
    if (!recipe) return { ok: false, reason: 'url_no_recipe' };
    return { ok: true, recipe };
  }

  const recipe = await parseRecipeText(input);
  return { ok: true, recipe };
}
