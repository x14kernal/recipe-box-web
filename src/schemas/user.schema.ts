import z from 'zod';
import { responseSchema } from './api.schema';

const userFieldsSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export const userSchema = userFieldsSchema.extend({
  id: z.uuid(),
});

const password = z.string().min(8).max(24);
// For requests
export const signupSchema = userFieldsSchema.extend({ password });
export const loginSchema = userFieldsSchema.extend({ password });

// For responses
export const signupResSchema = responseSchema(userSchema);
export const userResSchema = responseSchema(userSchema);
export const loginResSchema = responseSchema(
  z.object({
    user: userSchema,
    token: z.string(),
  })
);
