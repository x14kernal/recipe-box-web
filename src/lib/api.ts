import z from 'zod';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

type TReqFn = <T>(
  path: string,
  schema: z.ZodType<T>,
  options?: RequestOptions
) => Promise<T>;

const request: TReqFn = async (path, schema, options) => {
  const url = `${import.meta.env.VITE_API_URL}${path}`;

  let headers = Object.fromEntries(new Headers(options?.headers));
  if (options?.auth) {
    const token = localStorage.getItem('recipes-token');
    if (!token) throw new Error('Authentication required');
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  const test = z.safeParse(schema, data);
  if (!test.success) throw test.error;
  return test.data;
};

type TGetFn = <TRes>(
  path: string,
  resSchema: z.ZodType<TRes>,
  auth?: boolean
) => Promise<TRes>;

const get: TGetFn = async (path, resSchema, auth = false) => {
  return request(path, resSchema, { auth });
};

type TPostFn = <TReq, TRes>(
  path: string,
  data: TReq,
  reqSchema: z.ZodType<TReq>,
  resSchema: z.ZodType<TRes>,
  auth?: boolean
) => Promise<TRes>;

const post: TPostFn = async (
  path,
  data,
  reqSchema,
  resSchema,
  auth = false
) => {
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
  return request(path, resSchema, { ...options, auth });
};

export const api = {
  get,
  post,
};
