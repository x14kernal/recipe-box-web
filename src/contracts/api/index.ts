import z from 'zod';
import { paginationSchema } from '../pagination/index';

export const apiSuccessSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    success: z.literal(true),
    data: itemSchema,
    meta: z.object({}),
  });

export const apiSuccessWithoutDataSchema = () =>
  z.object({
    success: z.literal(true),
    data: z.null(),
    meta: z.object({}),
  });

export const apiSuccessWithMetaSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    success: z.literal(true),
    data: itemSchema,
    meta: paginationSchema,
  });

const errorDetails = z.object({
  field: z.string(),
  message: z.string(),
});

export const apiErrorSchema = () =>
  z.object({
    success: z.literal(false),
    error: z.object({
      message: z.string(),
      code: z.string(),
      details: z.array(errorDetails).optional(),
    }),
  });

export const responseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.discriminatedUnion('success', [apiSuccessSchema(itemSchema), apiErrorSchema()]);

export const responseWithMetaSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.discriminatedUnion('success', [apiSuccessWithMetaSchema(itemSchema), apiErrorSchema()]);

export const responseWithoutDataSchema = () =>
  z.discriminatedUnion('success', [apiSuccessWithoutDataSchema(), apiErrorSchema()]);
