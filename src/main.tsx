import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { AuthProvider } from './contexts/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import RootLayout from './layouts/RootLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import EditRecipePage from './pages/recipes/EditRecipePage';
import MyRecipePage from './pages/recipes/MyRecipePage';
import MyRecipesPage from './pages/recipes/MyRecipesPage';
import NewRecipePage from './pages/recipes/NewRecipePage';
import RecipePage from './pages/recipes/RecipePage';
import RecipesPage from './pages/recipes/RecipesPage';
import MyTrashedRecipesPage from './pages/recipes/MyTrashedRecipesPage';
import MyTrashedRecipePage from './pages/recipes/MyTrashedRecipePage';
import BookmarksPage from './pages/recipes/BookmarksPage';

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { index: true, Component: RecipesPage },
      { path: 'recipes', Component: RecipesPage },
      { path: 'recipes/:id', Component: RecipePage },
      {
        Component: ProtectedLayout,
        children: [
          { path: 'recipes/new', Component: NewRecipePage },
          { path: 'recipes/bookmarks', Component: BookmarksPage },
          { path: 'recipes/mine', Component: MyRecipesPage },
          { path: 'recipes/mine/:id', Component: MyRecipePage },
          { path: 'recipes/trash', Component: MyTrashedRecipesPage },
          { path: 'recipes/trash/:id', Component: MyTrashedRecipePage },
          { path: 'recipes/:id/edit', Component: EditRecipePage },
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
