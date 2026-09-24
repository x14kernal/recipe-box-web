import RegisterForm from '../../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">Enter your details below to create your account.</p>
      </div>

      <RegisterForm />
    </main>
  );
}
