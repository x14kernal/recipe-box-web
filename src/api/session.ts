import type { ID } from '@/contracts/recipe/common';
import { api } from '../lib/api';
import { sessionsResSchema } from '@/contracts/session';

const PATH = '/sessions';

const all = async (path = PATH) => api.get(path, sessionsResSchema);
const logout = async (id: ID) => api.remove(`${PATH}/${id}`);

export const session = { all, logout };
