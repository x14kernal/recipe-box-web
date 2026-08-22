import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import RecipesPage from './pages/RecipesPage';
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: RecipesPage,
      },
      {
        path: 'recipes',
        Component: RecipesPage,
      },
    ],
  },
  {
    Component: AuthLayout,
    children: [
      { path: '/login', Component: LoginPage },
      { path: '/signup', Component: SignupPage },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
