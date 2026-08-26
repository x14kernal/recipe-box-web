import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { useRecipe } from '../../hooks/useRecipe';
import { useAuth } from '../../contexts/AuthContext';
import { recipes } from '../../api/recipes';
import { useState } from 'react';

export default function RecipePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { recipe, loading, error } = useRecipe(id!);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const location = useLocation();
  const success = location.state?.success;
  const navigate = useNavigate();

  async function handleDelete(id: string) {
    setLoadingDelete(true);
    setDeleteError(null);

    try {
      await recipes.remove(id);
      navigate('/recipes');
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : 'Failed to delete recipe'
      );
    } finally {
      setLoadingDelete(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Recipe not found</p>;

  return (
    <div className="flex flex-col gap-4">
      {success && <p className="text-green-700">{success}</p>}

      {deleteError && <p className="text-red-700">{deleteError}</p>}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl">{recipe?.title}</h2>
        {user && user.id === recipe.ownerId && (
          <div className="flex items-center gap-4">
            <Link to={`/recipes/${recipe.id}/edit`}>Edit</Link>
            <button onClick={() => handleDelete(recipe.id)}>
              {loadingDelete ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
      <ul>
        {recipe?.ingredients.map((ing) => (
          <li key={ing}>{ing}</li>
        ))}
      </ul>

      <ul>
        {recipe?.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>

      <ul className="flex gap-2">
        {recipe?.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  );
}
