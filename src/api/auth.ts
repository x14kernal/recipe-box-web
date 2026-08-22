import { api } from '../lib/api';
import {
  loginResSchema,
  loginSchema,
  signupResSchema,
  signupSchema,
  userResSchema,
} from '../schemas/user.schema';
import type { LoginUser, SignupUser } from '../types/user';

const signup = async (data: SignupUser) => {
  return api.post('/auth/signup', data, signupSchema, signupResSchema);
};

const login = async (data: LoginUser) => {
  return api.post('/auth/login', data, loginSchema, loginResSchema);
};

const me = async () => {
  return api.get('/auth/me', userResSchema, true);
};

const logout = async () => {};

export const auth = {
  signup,
  login,
  logout,
  me,
};
