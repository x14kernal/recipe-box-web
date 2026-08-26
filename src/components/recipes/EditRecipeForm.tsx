import type { Recipe, RecipeFormValues } from '../../types/recipe';
import { toFormValues, toUpdateRecipe } from '../../mappers/recipe';
import { useNavigate } from 'react-router';
import { recipes } from '../../api/recipes';
import RecipeForm from './RecipeForm';

export default function EditRecipeForm({ recipe }: { recipe: Recipe }) {
  const navigate = useNavigate();

  async function handleSubmit(values: RecipeFormValues) {
    const update = toUpdateRecipe(values);

    const response = await recipes.update(recipe.id, update);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    navigate(`/recipes/${recipe.id}`, {
      state: { success: 'Recipe updated successfully!' },
    });
  }

  return (
    <RecipeForm
      initialValues={toFormValues(recipe)}
      onSubmit={handleSubmit}
      submitLabel="Save Changes"
      loadingLabel="Saving..."
    />
  );
}
