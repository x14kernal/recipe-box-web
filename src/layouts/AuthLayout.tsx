import { Navigate, Outlet } from 'react-router';

import { Skeleton } from '@/components/ui/skeleton';

import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Skeleton className="h-6 w-24" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:py-20 md:py-24">
        <section className="w-full max-w-md">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
