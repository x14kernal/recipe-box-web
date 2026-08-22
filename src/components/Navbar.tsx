import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="w-full mx-auto flex gap-4 items-center justify-end px-4 py-3">
      {user && (
        <div className="flex items-center justify-between gap-3 text-sm">
          <p className=" capitalize">welcome, {user.email.split('@')[0]}</p>
          <button type="button" className="cursor-pointer" onClick={logout}>
            Logout
          </button>
        </div>
      )}
      {!user && (
        <>
          <Link to={'/login'}>Login</Link>
          <Link to={'/signup'}>Signup</Link>
        </>
      )}
    </nav>
  );
}
