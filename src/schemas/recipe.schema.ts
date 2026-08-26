import z from 'zod';
import { responseSchema } from './api.schema';

// -------------------------
// UI / Form schemas
// -------------------------

export const ingredientFieldsSchema = z.object({
  quantity: z.number().min(1),
  unit: z.string().min(2),
  item: z.string().min(3),
});
export const ingredientSchema = ingredientFieldsSchema.extend({
  id: z.string(),
});

export const stepSchema = z.object({
  id: z.string(),
  description: z.string().min(3),
});

export const tagSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
});

export const recipeFormSchema = z.object({
  title: z.string().min(4),
  ingredients: z
    .array(ingredientSchema)
    .min(1, 'At least one ingredient is required'),
  steps: z.array(stepSchema).min(1, 'At least one step is required'),
  tags: z.array(tagSchema),
});

// -------------------------
// API schemas
// -------------------------

const recipeFieldsSchema = z.object({
  title: z.string().min(4),
  ingredients: z
    .array(z.string().min(3))
    .min(1, 'At least one ingredient is required'),
  steps: z.array(z.string()).min(1, 'At least one step is required'),
  tags: z.array(z.string()),
});
export const recipeSchema = recipeFieldsSchema.extend({
  id: z.uuid(),
  ownerId: z.uuid(),
});
export const createRecipeSchema = recipeFieldsSchema;
export const updateRecipeSchema = recipeFieldsSchema.partial();

// -------------------------
// API response schemas
// -------------------------

export const recipeResSchema = responseSchema(recipeSchema);
export const recipesResSchema = responseSchema(z.array(recipeSchema));
