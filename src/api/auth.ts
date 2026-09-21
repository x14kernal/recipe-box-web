import { api } from '../lib/api';

import {
  loginResSchema,
  loginSchema,
  logoutResSchema,
  logoutSchema,
  registerResSchema,
  registerSchema,
  userResSchema,
  type LoginUser,
  type RegisterUser,
} from '../contracts/user';

const register = async (data: RegisterUser) => {
  return api.post('/auth/register', data, registerSchema, registerResSchema);
};

const login = async (data: LoginUser) => {
  return api.post('/auth/login', data, loginSchema, loginResSchema);
};

const me = async () => api.get('/auth/me', userResSchema);

const logout = async () => api.post('/auth/logout', {}, logoutSchema, logoutResSchema);

export const auth = {
  register,
  login,
  logout,
  me,
};
