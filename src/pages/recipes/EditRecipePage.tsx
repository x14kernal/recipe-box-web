import { Navigate, useParams } from 'react-router';

import EditRecipeForm from '../../components/recipes/EditRecipeForm';
import { useAuth } from '../../contexts/AuthContext';
import { useRecipe } from '../../hooks/useRecipe';

export default function EditRecipePage() {
  const { id } = useParams();
  const { user, loading: userLoading } = useAuth();
  const { recipe, loading: recipeLoading } = useRecipe(id ?? '', 'mine');

  if (userLoading || recipeLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!recipe) {
    return <p>Recipe not found.</p>;
  }

  if (recipe.ownerId !== user.id) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Update recipe</h1>

        <p className="text-muted-foreground mt-1 text-sm">
          Update your recipe details, ingredients, steps, and images.
        </p>
      </div>

      <EditRecipeForm recipe={recipe} />
    </div>
  );
}
