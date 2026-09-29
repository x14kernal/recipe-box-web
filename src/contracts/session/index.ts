import z from 'zod';
import { responseSchema, responseWithoutDataSchema } from '../api';

const sessionSchema = z.object({
  id: z.string(),
  userAgent: z.string().nullable(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  lastSeenAt: z.coerce.date(),
  isCurrent: z.boolean(),
});

const sessionsSchema = z.array(sessionSchema);

export const sessionsResSchema = responseSchema(sessionsSchema);

export const deleteSessionResSchema = responseWithoutDataSchema();

export type Session = z.infer<typeof sessionSchema>;
