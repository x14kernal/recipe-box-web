import './index.css';

import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';

import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedLayout from './layouts/ProtectedLayout';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RecipesPage from './pages/recipes/RecipesPage';
import RecipePage from './pages/recipes/RecipePage';
import NewRecipePage from './pages/recipes/NewRecipePage';
import EditRecipePage from './pages/recipes/EditRecipePage';
import MyRecipesPage from './pages/recipes/MyRecipesPage';
import MyRecipePage from './pages/recipes/MyRecipePage';

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
        path: 'recipes/mine',
        Component: MyRecipesPage,
      },
      {
        path: 'recipes/mine/:id',
        Component: MyRecipePage,
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
      { path: '/register', Component: RegisterPage },
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
