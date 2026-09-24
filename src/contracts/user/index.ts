import z from 'zod';
import { responseSchema, responseWithoutDataSchema } from '../api/index';

const userBaseSchema = z.object({
  email: z.email().trim().toLowerCase(),
  username: z.string().trim().toLowerCase().min(4, 'Username is required'),
  displayName: z.string().trim().toLowerCase().nullable(),
});

export const userSchema = userBaseSchema.extend({ id: z.uuid() });

const passwordSchema = z.string().min(8).max(24);

// For requests
export const registerSchema = userBaseSchema.extend({ password: passwordSchema });

export const loginSchema = z.object({
  identifier: z.string().trim().toLowerCase().min(4, 'Email or username is required'),
  password: passwordSchema,
});

export const logoutSchema = z.object({});

// For responses
export const registerResSchema = responseSchema(userSchema);
export const userResSchema = responseSchema(userSchema);
export const loginResSchema = responseSchema(userSchema);
export const logoutResSchema = responseWithoutDataSchema();

// Types
export type User = z.infer<typeof userSchema>;
export type RegisterUser = z.infer<typeof registerSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
export type LogoutUser = z.infer<typeof logoutSchema>;
