import z from 'zod';
import { idSchema } from './common';
import { responseSchema } from '../api';

export const ingredientSchema = z.object({
  id: idSchema,
  name: z.string().trim().toLowerCase().min(2).max(80),
  slug: z.string(),
  image: z.url().trim().nullish(),
});

const recipeIngredientAmountSchema = z.object({
  quantity: z.coerce.number().positive(),
  unit: z.string().trim().toLowerCase().min(1).max(20),
});

export const newRecipeIngredientSchema = z
  .object({
    name: z.string().trim().toLowerCase().min(2).max(80),
    image: z.string().trim().url().nullable(),
  })
  .extend(recipeIngredientAmountSchema.shape);

export const existingRecipeIngredientSchema = z.object({ id: idSchema }).extend(recipeIngredientAmountSchema.shape);

export const recipeIngredientInputSchema = z.union([newRecipeIngredientSchema, existingRecipeIngredientSchema]);

export type Ingredient = z.infer<typeof ingredientSchema>;
export type NewRecipeIngredient = z.infer<typeof newRecipeIngredientSchema>;
export type ExistingRecipeIngredient = z.infer<typeof existingRecipeIngredientSchema>;
export type RecipeIngredientInput = z.infer<typeof recipeIngredientInputSchema>;

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------
export const ingredientsResSchema = responseSchema(z.array(ingredientSchema));
