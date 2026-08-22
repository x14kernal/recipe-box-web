import { api } from '../lib/api';
import { recipeResSchema, recipesResSchema } from '../schemas/recipe.schema';

const all = async (path = '/recipes') => api.get(path, recipesResSchema);
const random = async () => api.get('/recipes/random', recipeResSchema);
const one = async () => {};
const create = async () => {};
const update = async () => {};
const remove = async () => {};

export const recipes = {
  all,
  random,
  one,
  create,
  update,
  remove,
};
