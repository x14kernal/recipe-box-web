import z from 'zod';
import { responseSchema } from './api.schema';
const recipeFieldsSchema = z.object({
  title: z.string().min(4),
  ingredients: z
    .array(z.string().min(3))
    .min(1, 'At least one ingredient item is required'),
  steps: z
    .array(z.string().min(3))
    .min(1, 'At least one step item is required'),
  tags: z.array(z.string().min(3)),
});
export const recipeSchema = recipeFieldsSchema.extend({
  id: z.string(),
});

// For requests
export const createRecipeSchema = recipeFieldsSchema;
export const updateRecipeSchema = recipeFieldsSchema.partial();

// For responses
export const recipesResSchema = responseSchema(z.array(recipeSchema));
export const recipeResSchema = responseSchema(recipeSchema);
