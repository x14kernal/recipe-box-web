import { api } from '../lib/api';
import {
  createRecipeSchema,
  recipeResSchema,
  recipesResSchema,
  updateRecipeSchema,
} from '../schemas/recipe.schema';
import type { CreateRecipe, UpdateRecipe } from '../types/recipe';

const all = async (path = '/recipes') => api.get(path, recipesResSchema);

const random = async () => api.get('/recipes/random', recipeResSchema);

const one = async (id: string) => api.get(`/recipes/${id}`, recipeResSchema);

const create = async (data: CreateRecipe) =>
  api.post('/recipes', data, createRecipeSchema, recipeResSchema, true);

const update = async (id: string, data: UpdateRecipe) =>
  api.patch(`/recipes/${id}`, data, updateRecipeSchema, recipeResSchema, true);

const remove = async (id: string) => api.remove(`/recipes/${id}`, true);

export const recipes = {
  all,
  random,
  one,
  create,
  update,
  remove,
};
