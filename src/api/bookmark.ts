import { recipesResSchema } from '@/contracts/recipe';

import { api } from '../lib/api';

const PATH = '/bookmarks';

const all = async (path = PATH) => api.get(path, recipesResSchema);

export const bookmark = { all };
