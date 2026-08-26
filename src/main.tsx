import './index.css';

import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';

import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedLayout from './layouts/ProtectedLayout';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import RecipesPage from './pages/recipes/RecipesPage';
import RecipePage from './pages/recipes/RecipePage';
import NewRecipePage from './pages/recipes/NewRecipePage';
import EditRecipePage from './pages/recipes/EditRecipePage';

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
      {
        path: 'recipes/:id',
        Component: RecipePage,
      },
      {
        Component: ProtectedLayout,
        children: [
          {
            path: 'recipes/new',
            Component: NewRecipePage,
          },
          {
            path: 'recipes/:id/edit',
            Component: EditRecipePage,
          },
        ],
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
