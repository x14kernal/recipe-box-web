import z from 'zod';
import { idSchema } from './common';

export const newRecipeImageSchema = z.object({ imageUrl: z.url() });

export const recipeImageSchema = newRecipeImageSchema.extend({ id: idSchema });

export type NewRecipeImage = z.infer<typeof newRecipeImageSchema>;
export type RecipeImage = z.infer<typeof recipeImageSchema>;
