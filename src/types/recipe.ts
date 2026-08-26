import z from 'zod';
import type {
  createRecipeSchema,
  ingredientFieldsSchema,
  ingredientSchema,
  recipeFormSchema,
  recipeSchema,
  recipesResSchema,
  stepSchema,
  tagSchema,
  updateRecipeSchema,
} from '../schemas/recipe.schema';

export type Recipe = z.infer<typeof recipeSchema>;

export type CreateRecipe = z.infer<typeof createRecipeSchema>;
export type UpdateRecipe = z.infer<typeof updateRecipeSchema>;

export type RecipeList = z.infer<typeof recipesResSchema>;

export type IngredientFields = z.infer<typeof ingredientFieldsSchema>;
export type Ingredient = z.infer<typeof ingredientSchema>;
export type Step = z.infer<typeof stepSchema>;
export type Tag = z.infer<typeof tagSchema>;

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
