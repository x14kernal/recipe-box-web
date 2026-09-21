import z from 'zod';
import { idSchema } from './common';
import { responseSchema } from '../api';

export const tagSchema = z.object({
  id: idSchema,
  name: z.string().trim().toLowerCase().min(3).max(30),
  slug: z.string(),
});

export const newRecipeTagSchema = z.object({
  name: z.string().trim().toLowerCase().min(3).max(30),
});

export const existingRecipeTagSchema = z.object({ id: idSchema });

export const recipeTagInputSchema = z.union([newRecipeTagSchema, existingRecipeTagSchema]);

export type Tag = z.infer<typeof tagSchema>;
export type NewRecipeTag = z.infer<typeof newRecipeTagSchema>;
export type ExistingRecipeTag = z.infer<typeof existingRecipeTagSchema>;
export type RecipeTagInput = z.infer<typeof recipeTagInputSchema>;

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------
export const tagsResSchema = responseSchema(z.array(tagSchema));
