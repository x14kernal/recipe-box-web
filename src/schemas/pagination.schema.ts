import z from 'zod';

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  prev: z.string().nullable(),
  next: z.string().nullable(),
});
