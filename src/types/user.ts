import z from 'zod';
import type {
  loginSchema,
  signupSchema,
  userSchema,
} from '../schemas/user.schema';

export type User = z.infer<typeof userSchema>;
export type SignupUser = z.infer<typeof signupSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
