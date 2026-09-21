import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { useRecipe } from '../../hooks/useRecipe';
import { useAuth } from '../../contexts/AuthContext';
import { recipe as recipeApi } from '../../api/recipe';
import { useState } from 'react';

export default function MyRecipePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { recipe, loading, error } = useRecipe(id!, 'mine');

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const location = useLocation();
  const success = location.state?.success;
  const navigate = useNavigate();

  async function handleDelete(id: string) {
    setLoadingDelete(true);
    setDeleteError(null);

    try {
      await recipeApi.remove(id);
      navigate('/recipes/mine');
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete recipe');
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
            <button className="cursor-pointer" onClick={() => handleDelete(recipe.id)}>
              {loadingDelete ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
      <ul>
        {recipe?.ingredients.map(({ id, name, slug }) => (
          <li key={id}>
            {name} <span className="text-yellow-800">{slug}</span>
          </li>
        ))}
      </ul>

      <ul>
        {recipe?.steps.map(({ id, description, position, image }) => (
          <li key={id}>
            {position}: {description}
            {image && <img src={image} alt="" />}
          </li>
        ))}
      </ul>

      <ul className="flex gap-2">
        {recipe?.tags.map(({ id, name, slug }) => (
          <li key={id}>
            {name} <span className="text-yellow-800">{slug}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
