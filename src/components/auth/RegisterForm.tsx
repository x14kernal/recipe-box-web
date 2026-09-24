import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router';

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

function parseRegisterError(error: unknown): Record<string, string> {
  let value: unknown = error;

  if (error instanceof Error) {
    value = error.message;
  }

  if (typeof value === 'string') {
    const rawMessage = value;

    try {
      value = JSON.parse(rawMessage);
    } catch {
      return {
        form: rawMessage || 'Unable to create your account.',
      };
    }
  }

  if (isZodIssues(value)) {
    return Object.fromEntries(value.map((issue) => [issue.path.join('.'), issue.message]));
  }

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
    form: 'Unable to create your account. Please try again.',
  };
}

export default function RegisterForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register, isRegistering } = useAuth();
  const navigate = useNavigate();

  async function submitHandler(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const formData = new FormData(event.currentTarget);

    const email = formData.get('email');
    const username = formData.get('username');
    const password = formData.get('password');
    const displayName = formData.get('displayName');

    if (
      typeof email !== 'string' ||
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      typeof displayName !== 'string'
    ) {
      setErrors({
        form: 'Please fill in all fields.',
      });
      return;
    }

    try {
      await register({
        email: email.trim(),
        username: username.trim(),
        password,
        displayName: displayName.trim(),
      });

      navigate('/', { replace: true });
    } catch (error: unknown) {
      setErrors(parseRegisterError(error));
    }
  }

  return (
    <form onSubmit={submitHandler} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="displayName">Name</Label>

        <Input
          id="displayName"
          name="displayName"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          disabled={isRegistering}
          aria-invalid={Boolean(errors.displayName)}
          aria-describedby={errors.displayName ? 'displayName-error' : undefined}
        />

        {errors.displayName && (
          <p id="displayName-error" className="text-sm text-destructive">
            {errors.displayName}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isRegistering}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />

        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>

        <Input
          id="username"
          name="username"
          type="text"
          placeholder="username"
          autoComplete="username"
          disabled={isRegistering}
          aria-invalid={Boolean(errors.username)}
          aria-describedby={errors.username ? 'username-error' : undefined}
        />

        {errors.username && (
          <p id="username-error" className="text-sm text-destructive">
            {errors.username}
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
          autoComplete="new-password"
          disabled={isRegistering}
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

      <Button type="submit" className="w-full" disabled={isRegistering}>
        {isRegistering ? 'Creating account...' : 'Register'}
      </Button>
    </form>
  );
}
