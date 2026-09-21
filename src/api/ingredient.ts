import { ingredientsResSchema } from '../contracts/recipe/ingredient';
import { api } from '../lib/api';

const all = async (path = '/ingredients') => api.get(path, ingredientsResSchema);

export const ingredient = { all };
