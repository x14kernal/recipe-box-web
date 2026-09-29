import { Navigate, useParams } from 'react-router';

import EditRecipeForm from '../../components/recipes/EditRecipeForm';
import { useAuth } from '../../contexts/AuthContext';
import { useRecipe } from '../../hooks/useRecipe';
import { PageHeader } from '@/components/PageHeader';

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
      <PageHeader
        eyebrow="Your recipes"
        title="Update recipe"
        description="Update your recipe details, ingredients, steps, and images."
      />

      <EditRecipeForm recipe={recipe} />
    </div>
  );
}
