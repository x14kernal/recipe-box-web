import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="w-full mx-auto flex gap-1 items-center justify-between px-2 py-6">
      <Link to={'/'} className="font-black text-sm">
        RECIPES-X
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center justify-between gap-4 text-sm">
            {/* <p className="capitalize">welcome, {user.displayName}</p> */}
            <Link to={'/recipes/new'}>Add Recipe</Link>
            <button type="button" className="cursor-pointer" onClick={logout}>
              Logout
            </button>
          </div>
        )}
        {!user && (
          <>
            <Link to={'/login'}>Login</Link>
            <Link to={'/register'}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
