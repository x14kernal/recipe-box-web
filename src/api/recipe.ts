import { idSchema, type ID } from '@/contracts/recipe/common';
import {
  bookmarkResSchema,
  createRecipeSchema,
  recipeResSchema,
  recipesResSchema,
  restoreResSchema,
  trashResSchema,
  updateRecipeSchema,
  type CreateRecipe,
  type UpdateRecipe,
} from '../contracts/recipe';
import { api } from '../lib/api';
import z from 'zod';

const all = async (path = '/recipes') => api.get(path, recipesResSchema);

const random = async () => api.get('/recipes/random', recipeResSchema);

const one = async (id: ID, path = '/recipes') => api.get(`${path}/${id}`, recipeResSchema);

const create = async (data: CreateRecipe) => api.post('/recipes', data, createRecipeSchema, recipeResSchema);

const update = async (id: ID, data: UpdateRecipe) =>
  api.patch(`/recipes/${id}`, data, updateRecipeSchema, recipeResSchema);

const trash = async (id: ID) => api.patch(`/recipes/${id}/trash`, undefined, undefined, trashResSchema);

const restore = async (id: ID) => api.patch(`/recipes/${id}/restore`, undefined, undefined, restoreResSchema);

const bookmark = async (id: ID) =>
  api.post(`/recipes/${id}/bookmark`, { id }, z.object({ id: idSchema }), bookmarkResSchema);

const unbookmark = async (id: ID) => api.remove(`/recipes/${id}/bookmark`);

const remove = async (id: ID) => api.remove(`/recipes/${id}`);

export const recipe = { all, random, one, create, update, remove, trash, restore, bookmark, unbookmark };
