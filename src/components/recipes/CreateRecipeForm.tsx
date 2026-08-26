import type { RecipeFormValues } from '../../types/recipe';
import { toCreateRecipe, toFormValues } from '../../mappers/recipe';
import { useNavigate } from 'react-router';
import { recipes } from '../../api/recipes';
import RecipeForm from './RecipeForm';

export default function CreateRecipeForm() {
  const navigate = useNavigate();

  async function handleSubmit(values: RecipeFormValues) {
    const recipe = toCreateRecipe(values);

    const response = await recipes.create(recipe);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    navigate(`/recipes/${response.data.id}`, {
      state: { success: 'Recipe created successfully!' },
    });
  }

  return (
    <RecipeForm
      initialValues={toFormValues()}
      submitLabel="Create Recipe"
      loadingLabel="Creating..."
      onSubmit={handleSubmit}
    />
  );
}
