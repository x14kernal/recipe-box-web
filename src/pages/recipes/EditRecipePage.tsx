import { Navigate, useParams } from 'react-router';
import EditRecipeForm from '../../components/recipes/EditRecipeForm';
import { useRecipe } from '../../hooks/useRecipe';
import { useAuth } from '../../contexts/AuthContext';

export default function EditRecipePage() {
  const { id } = useParams();
  const { user, loading: userLoading } = useAuth();
  const { recipe, loading: recipeLoading } = useRecipe(id ?? '');

  if (recipeLoading || userLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!recipe) {
    return <p>Recipe not found.</p>;
  }

  // check if this recipe belonge to this user
  if (user.id !== recipe.ownerId) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <h1 className="text-4xl p-2 mb-4">Update recipe</h1>
      <EditRecipeForm recipe={recipe} />
    </>
  );
}
