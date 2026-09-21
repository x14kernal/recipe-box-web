import z from 'zod';

type TReqFn = <T>(path: string, schema: z.ZodType<T>, options?: RequestInit) => Promise<T>;

const request: TReqFn = async (path, schema, options?) => {
  const url = `${import.meta.env.VITE_API_URL}${path}`;

  const headers = new Headers(options?.headers);
  const res = await fetch(url, { ...options, headers, credentials: 'include' });

  const data = await res.json();
  const test = z.safeParse(schema, data);
  if (!test.success) throw test.error;
  return test.data;
};

type TGetFn = <TRes>(path: string, resSchema: z.ZodType<TRes>) => Promise<TRes>;

const get: TGetFn = async (path, resSchema) => {
  return request(path, resSchema);
};

type TPostFn = <TReq, TRes>(
  path: string,
  data: TReq,
  reqSchema: z.ZodType<TReq>,
  resSchema: z.ZodType<TRes>
) => Promise<TRes>;

const post: TPostFn = async (path, data, reqSchema, resSchema) => {
  // check data aginst reqSchema before calling request
  const test = z.safeParse(reqSchema, data);
  if (!test.success) throw test.error;

  // if has valid data go
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(test.data),
  };
  return request(path, resSchema, options);
};

type TPatchFn = <TReq, TRes>(
  path: string,
  data: TReq,
  reqSchema: z.ZodType<TReq>,
  resSchema: z.ZodType<TRes>
) => Promise<TRes>;

const patch: TPatchFn = async (path, data, reqSchema, resSchema) => {
  // check data aginst reqSchema before calling request
  const test = z.safeParse(reqSchema, data);
  if (!test.success) throw test.error;

  // if has valid data go
  const options = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(test.data),
  };
  return request(path, resSchema, options);
};

const remove = async (path: string): Promise<void> => {
  const url = `${import.meta.env.VITE_API_URL}${path}`;
  const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
};

export const api = { get, post, patch, remove };
