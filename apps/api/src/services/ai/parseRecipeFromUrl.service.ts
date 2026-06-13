import * as cheerio from 'cheerio';
import type { ParsedRecipe } from './parseRecipe.service.js';

// shape of a Recipe object from Schema.org's standard
type SchemaRecipe = {
  '@type': string;
  name?: string;
  recipeYield?: string | string[];
  url?: string;
  author?: { name?: string } | string;
  description?: string;
  recipeIngredient?: string[];
  recipeInstructions?: Array<{ '@type': string; text: string } | string>;
  keywords?: string | string[];
  recipeCuisine?: string;
  recipeCategory?: string;
};

const decodeHtml = (str: string): string => {
  const $ = cheerio.load(`<span>${str}</span>`);
  return $('span').text();
};

function findRecipeInData(data: unknown): SchemaRecipe | undefined {
  if (!data || typeof data !== 'object') return undefined;

  // handle @graph pattern (yoast / wordpress sites)
  if ('@graph' in data) {
    const graph = (data as { '@graph': unknown[] })['@graph'];
    return graph.find(
      (item): item is SchemaRecipe =>
        typeof item === 'object' &&
        item !== null &&
        (item as SchemaRecipe)['@type'] === 'Recipe'
    );
  }

  // handle array of items
  if (Array.isArray(data)) {
    return data.find(
      (item): item is SchemaRecipe =>
        typeof item === 'object' &&
        item !== null &&
        (item as SchemaRecipe)['@type'] === 'Recipe'
    );
  }

  // handle single object
  if ((data as SchemaRecipe)['@type'] === 'Recipe') return data as SchemaRecipe;

  return undefined;
}

export async function parseRecipeFromUrl(url: string): Promise<ParsedRecipe | null> {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  for (const el of $('script[type="application/ld+json"]').toArray()) {
    let data: unknown;
    try {
      data = JSON.parse($(el).html() ?? '');
    } catch {
      continue;
    }

    const recipe = findRecipeInData(data);
    if (!recipe) continue;

    const steps = (recipe.recipeInstructions ?? []).map((step) =>
      typeof step === 'string' ? step : step.text
    );

    const tags = [
      ...(typeof recipe.keywords === 'string'
        ? recipe.keywords.split(',').map((k) => k.trim().toLowerCase())
        : (recipe.keywords ?? [])),
      recipe.recipeCuisine?.toLowerCase(),
      recipe.recipeCategory?.toLowerCase(),
    ]
      .filter((t): t is string => Boolean(t))
      .slice(0, 5);

    return {
      title: decodeHtml(recipe.name ?? ''),
      yield: Array.isArray(recipe.recipeYield)
        ? decodeHtml(recipe.recipeYield.join(', '))
        : decodeHtml(recipe.recipeYield ?? ''),
      source: url,
      notes: decodeHtml(recipe.description ?? ''),
      ingredients: (recipe.recipeIngredient ?? []).map(decodeHtml),
      steps: steps.map(decodeHtml),
      suggestedTags: tags,
    };
  }

  return null;
}
