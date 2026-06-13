import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type ParsedRecipe = {
  title: string;
  yield: string;
  source: string;
  notes: string;
  ingredients: string[];
  steps: string[];
  suggestedTags: string[];
};

const SYSTEM_PROMPT = `You are a recipe parser. Given raw recipe text, extract structured data and return it as JSON with exactly this shape:
{
  "title": "string — recipe name",
  "yield": "string — how much it makes, e.g. '4 servings' or '12 cookies' (empty string if unknown)",
  "source": "string — URL or attribution if present (empty string if none)",
  "notes": "string — any tips, variations, or personal notes. Keep each tip as a short sentence. Separate multiple tips with 2x newline. Empty string if none.",
  "ingredients": ["array of ingredient strings, one per item"],
  "steps": ["array of step strings, each a complete instruction"],
  "suggestedTags": ["array of 1-2 short tag name strings, e.g. 'vegetarian', 'quick', 'dessert', 'italian'"]
}

Rules:
- IMPORTANT: Return ONLY raw valid JSON. No markdown, no code fences, no explanation — just the JSON object itself.
- Keep ingredient strings intact with quantities (e.g. "2 cups flour")
- Keep step strings as complete sentences
- suggestedTags should be lowercase, concise, and useful for filtering (cuisine, diet, meal type, technique)
- If a field cannot be determined, use an empty string or empty array`;

export async function parseRecipeText(rawText: string): Promise<ParsedRecipe> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: rawText,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  let text = textBlock.text.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(text) as ParsedRecipe;
  return parsed;
}
