import { useState, type SubmitEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Form } from '../ui/Form';
import { useNavigate } from 'react-router';

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const { register, isRegistering } = useAuth();
  const navigate = useNavigate();

  async function submitHandler(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const username = formData.get('username');
    const password = formData.get('password');
    const displayName = formData.get('displayName');

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof username !== 'string' ||
      typeof displayName !== 'string'
    )
      return;

    try {
      await register({ email, password, username, displayName });
      navigate('/', { replace: true });
    } catch (error) {
      // you need to handle zod errors
      setError(error instanceof Error ? error.message : 'Something went wrong!');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Form onSubmit={submitHandler}>
        <Form.Input type="text" name="displayName" id="displayName" label="Name" />
        <Form.Input type="email" name="email" id="email" label="Email" />
        <Form.Input type="text" name="username" id="username" label="Username" />
        <Form.Input type="password" name="password" id="password" label="Password" />
        <Form.SubmitButton isLoading={isRegistering}>
          {isRegistering ? 'Creating account...' : 'Register'}
        </Form.SubmitButton>
      </Form>
      {error && <p>{error}</p>}
    </div>
  );
}
