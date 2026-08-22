import { useState, type SubmitEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Form } from './ui/Form';
import { useNavigate } from 'react-router';

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const { signup, isSigning } = useAuth();
  const navigate = useNavigate();

  async function submitHandler(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    if (typeof email !== 'string' || typeof password !== 'string') return;

    try {
      await signup(email, password);
      navigate('/', { replace: true });
    } catch (error) {
      // you need to handle zod errors
      setError(
        error instanceof Error ? error.message : 'Something went wrong!'
      );
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Form onSubmit={submitHandler}>
        <Form.Input type="email" name="email" id="email" label="Email" />
        <Form.Input
          type="password"
          name="password"
          id="password"
          label="Password"
        />
        <Form.SubmitButton isLoading={isSigning}>
          {isSigning ? 'Creating account...' : 'Signup'}
        </Form.SubmitButton>
      </Form>
      {error && <p>{error}</p>}
    </div>
  );
}
