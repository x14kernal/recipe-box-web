import z from 'zod';

export const idSchema = z.uuid();
export type ID = z.infer<typeof idSchema>;
