import { z } from 'zod';

type GetZodError = (issues: z.ZodError['issues'], ...path: (string | number)[]) => string;
export const getZodError: GetZodError = (issues, ...path) =>
  issues.find((e) => path.every((v, i) => e.path[i] === v))?.message ?? '';
