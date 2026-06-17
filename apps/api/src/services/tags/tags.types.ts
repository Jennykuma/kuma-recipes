import { z } from 'zod';

export const TAG_NAME_MAX_LENGTH = 24;

export const CreateTagBodySchema = z.object({
  name: z
    .string()
    .min(1, 'Tag name cannot be empty')
    .max(
      TAG_NAME_MAX_LENGTH,
      `Tag name must be ${TAG_NAME_MAX_LENGTH} characters or less`
    ),
});

export type CreateTagBody = z.infer<typeof CreateTagBodySchema>;

export type Tag = {
  id: string;
  name: string;
  slug: string;
  count?: number;
};
