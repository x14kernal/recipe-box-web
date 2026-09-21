import z from 'zod';

import { idSchema } from './common.js';

import { recipeIngredientInputSchema, ingredientSchema } from './ingredient.js';

import { recipeTagInputSchema, tagSchema } from './tag.js';

import { newRecipeStepSchema, recipeStepSchema } from './step.js';

import { newRecipeImageSchema, recipeImageSchema } from './image.js';
import { responseSchema, responseWithMetaSchema } from '../api/index.js';
import { userSchema } from '../user/index.js';

// ---------------------------------------------------------------------------
// Recipe
// ---------------------------------------------------------------------------

const recipeFieldsSchema = z.object({
  title: z.string().trim().min(4).max(200),
  servingSize: z.coerce.number().int().min(1).max(100),
  visibility: z.enum(['public', 'private']),

  ingredients: z.array(recipeIngredientInputSchema).min(1).max(50),
  steps: z.array(newRecipeStepSchema).min(1).max(50),
  tags: z.array(recipeTagInputSchema).min(1).max(10),
  images: z.array(newRecipeImageSchema).min(1).max(10),
});

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export const createRecipeSchema = recipeFieldsSchema;

export type CreateRecipe = z.infer<typeof createRecipeSchema>;

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export const updateRecipeSchema = recipeFieldsSchema.partial();

export type UpdateRecipe = z.infer<typeof updateRecipeSchema>;

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export const recipeSchema = z.object({
  id: idSchema,
  ownerId: idSchema,

  title: z.string(),
  servingSize: z.number(),
  visibility: z.enum(['public', 'private']),

  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),

  ingredients: z.array(ingredientSchema.extend({ quantity: z.number(), unit: z.string() })),

  steps: z.array(recipeStepSchema),

  tags: z.array(tagSchema),

  images: z.array(recipeImageSchema),

  user: userSchema.omit({ email: true }),
});

export type Recipe = z.infer<typeof recipeSchema>;

// ---------------------------------------------------------------------------
// Recipe list
// ---------------------------------------------------------------------------

export const recipeListItemSchema = z.object({
  id: idSchema,
  ownerId: idSchema,
  title: z.string(),
  servingSize: z.number(),
  visibility: z.enum(['public', 'private']),
  createdAt: z.iso.datetime(),
  user: userSchema.omit({ email: true }),
  coverImage: recipeImageSchema.nullable(),
  tags: z.array(tagSchema),
});

export type RecipeListItem = z.infer<typeof recipeListItemSchema>;

// ---------------------------------------------------------------------------
// Params
// ---------------------------------------------------------------------------

export const recipeIdParamsSchema = z.object({ recipeId: idSchema });

export type RecipeIdParams = z.infer<typeof recipeIdParamsSchema>;

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------

export const listRecipesQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    ingredients: z.string().trim().optional(),
    tags: z.string().trim().optional(),
    search: z.string().trim().max(100).optional(),
    sortBy: z.enum(['title', 'createdAt', 'servingSize']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
  })
  .strict();

export type ListRecipesQuery = z.infer<typeof listRecipesQuerySchema>;

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------
export const recipeResSchema = responseSchema(recipeSchema);
export const recipesResSchema = responseWithMetaSchema(z.array(recipeListItemSchema));
export const recipeFormSchema = createRecipeSchema;

export type RecipeRes = z.infer<typeof recipeResSchema>;
export type RecipesRes = z.infer<typeof recipesResSchema>;
export type RecipeForm = z.infer<typeof recipeFormSchema>;
