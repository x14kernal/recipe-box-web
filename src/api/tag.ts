import { tagsResSchema } from '../contracts/recipe/tag';
import { api } from '../lib/api';

const all = async (path = '/tags') => api.get(path, tagsResSchema);

export const tag = { all };
