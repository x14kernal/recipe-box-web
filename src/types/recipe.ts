import z from 'zod';
import type {
  createRecipeSchema,
  recipeSchema,
  recipesResSchema,
  updateRecipeSchema,
} from '../schemas/recipe.schema';

export type Recipe = z.infer<typeof recipeSchema>;
export type CreateRecipe = z.infer<typeof createRecipeSchema>;
export type UpdateRecipe = z.infer<typeof updateRecipeSchema>;
export type RecipeList = z.infer<typeof recipesResSchema>;
