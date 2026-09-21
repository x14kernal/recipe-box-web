import z from 'zod';
import { idSchema } from './common';

export const newRecipeStepSchema = z.object({
  description: z.string().trim().min(1).max(2000),
  image: z.url().trim().nullish(),
});

export const recipeStepSchema = newRecipeStepSchema.extend({
  id: idSchema,
  position: z.int().positive(),
});

export type NewRecipeStep = z.infer<typeof newRecipeStepSchema>;
export type RecipeStep = z.infer<typeof recipeStepSchema>;
