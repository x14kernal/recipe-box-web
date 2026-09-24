import { useState, type SubmitEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAuth } from '../../contexts/AuthContext';

type ZodIssue = {
  origin?: string;
  code?: string;
  minimum?: number;
  inclusive?: boolean;
  path: (string | number)[];
  message: string;
};

function isZodIssue(value: unknown): value is ZodIssue {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('path' in value) || !('message' in value)) {
    return false;
  }

  const { path, message } = value;

  return (
    Array.isArray(path) &&
    path.every((part) => typeof part === 'string' || typeof part === 'number') &&
    typeof message === 'string'
  );
}

function isZodIssues(value: unknown): value is ZodIssue[] {
  return Array.isArray(value) && value.every(isZodIssue);
}

function parseLoginError(error: unknown): Record<string, string> {
  let value: unknown = error;

  if (error instanceof Error) {
    value = error.message;
  }

  // Handles JSON.stringify(zodIssues)
  if (typeof value === 'string') {
    const rawMessage = value;

    try {
      value = JSON.parse(rawMessage);
    } catch {
      return {
        form: rawMessage || 'Unable to log in.',
      };
    }
  }

  // Handles a raw Zod issue array:
  //
  // [
  //   {
  //     path: ['password'],
  //     message: 'Too small: expected string to have >=8 characters'
  //   }
  // ]
  if (isZodIssues(value)) {
    return Object.fromEntries(value.map((issue) => [issue.path.join('.'), issue.message]));
  }

  // Handles:
  //
  // {
  //   message: [
  //     {
  //       path: ['password'],
  //       message: 'Too small: expected string to have >=8 characters'
  //     }
  //   ]
  // }
  if (typeof value === 'object' && value !== null && 'message' in value) {
    const message: unknown = value.message;

    if (isZodIssues(message)) {
      return Object.fromEntries(message.map((issue) => [issue.path.join('.'), issue.message]));
    }

    if (typeof message === 'string') {
      return {
        form: message,
      };
    }
  }

  if (error instanceof Error) {
    return {
      form: error.message,
    };
  }

  return {
    form: 'Unable to log in. Please check your credentials and try again.',
  };
}

export default function LoginForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, isLogging } = useAuth();

  async function submitHandler(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const formData = new FormData(event.currentTarget);

    const identifier = formData.get('identifier');
    const password = formData.get('password');

    if (typeof identifier !== 'string' || typeof password !== 'string') {
      setErrors({
        form: 'Please enter your email/username and password.',
      });
      return;
    }

    try {
      await login({
        identifier: identifier.trim(),
        password,
      });
    } catch (error: unknown) {
      setErrors(parseLoginError(error));
    }
  }

  return (
    <form onSubmit={submitHandler} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="identifier">Email or username</Label>

        <Input
          id="identifier"
          name="identifier"
          type="text"
          placeholder="you@example.com"
          autoComplete="username"
          disabled={isLogging}
          aria-invalid={Boolean(errors.identifier)}
          aria-describedby={errors.identifier ? 'identifier-error' : undefined}
        />

        {errors.identifier && (
          <p id="identifier-error" className="text-sm text-destructive">
            {errors.identifier}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>

        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={isLogging}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />

        {errors.password && (
          <p id="password-error" className="text-sm text-destructive">
            {errors.password}
          </p>
        )}
      </div>

      {errors.form && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {errors.form}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isLogging}>
        {isLogging ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
