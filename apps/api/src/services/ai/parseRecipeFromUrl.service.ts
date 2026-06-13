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
  recipeInstructions?: Array<
    | string
    | { '@type': 'HowToStep'; text: string }
    | {
        '@type': 'HowToSection';
        itemListElement: Array<{ '@type': 'HowToStep'; text: string }>;
      }
  >;
  keywords?: string | string[];
  recipeCuisine?: string | string[];
  recipeCategory?: string | string[];
};

const decodeHtml = (str: string): string => {
  const $ = cheerio.load(`<span>${str}</span>`);
  return $('span').text();
};

const toArray = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
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

    const steps = (recipe.recipeInstructions ?? []).flatMap((step) => {
      if (typeof step === 'string') return [step];
      if (step['@type'] === 'HowToSection')
        return step.itemListElement.map((s) => s.text);
      return [step.text];
    });

    const tags = [
      ...toArray(recipe.keywords).flatMap((k) =>
        k.split(',').map((s) => s.trim().toLowerCase())
      ),
      ...toArray(recipe.recipeCuisine).map((c) => c.toLowerCase()),
      ...toArray(recipe.recipeCategory).map((c) => c.toLowerCase()),
    ]
      .filter(Boolean)
      .slice(0, 5);

    return {
      title: decodeHtml(recipe.name ?? ''),
      yield: decodeHtml(toArray(recipe.recipeYield).join(', ')),
      source: url,
      notes: decodeHtml(recipe.description ?? ''),
      ingredients: (recipe.recipeIngredient ?? []).map(decodeHtml),
      steps: steps.map(decodeHtml),
      suggestedTags: tags,
    };
  }

  return null;
}
