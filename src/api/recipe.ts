import {
  createRecipeSchema,
  recipeResSchema,
  recipesResSchema,
  updateRecipeSchema,
  type CreateRecipe,
  type UpdateRecipe,
} from '../contracts/recipe';
import { api } from '../lib/api';

const all = async (path = '/recipes') => api.get(path, recipesResSchema);

const random = async () => api.get('/recipes/random', recipeResSchema);

const one = async (id: string, path = '/recipes') => api.get(`${path}/${id}`, recipeResSchema);

const create = async (data: CreateRecipe) => api.post('/recipes', data, createRecipeSchema, recipeResSchema);

const update = async (id: string, data: UpdateRecipe) =>
  api.patch(`/recipes/${id}`, data, updateRecipeSchema, recipeResSchema);

const remove = async (id: string) => api.remove(`/recipes/${id}`);

export const recipe = {
  all,
  random,
  one,
  create,
  update,
  remove,
};
