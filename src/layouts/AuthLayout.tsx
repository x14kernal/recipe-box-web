import { Navigate, Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading....</p>;

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 bg-sladte-200 min-h-screen px-1">
      <Navbar />
      <main className="flex justify-center items-center h-screen">
        <section className="w-full mx-auto max-w-md mb-50">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
