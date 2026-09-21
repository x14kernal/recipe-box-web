import { useNavigate } from 'react-router';
import { type Recipe, type RecipeForm } from '../../contracts/recipe';
import { recipe as recipeApi } from '../../api/recipe';
import { getFormValues, toUpdateRecipe } from '../../mappers/recipe';
import RecipeFormTemplate from './RecipeFormTemplate';

export default function EditRecipeForm({ recipe }: { recipe: Recipe }) {
  const navigate = useNavigate();

  async function submitHandler(data: RecipeForm) {
    const response = await recipeApi.update(recipe.id, toUpdateRecipe(data, recipe));

    if (!response.success) throw new Error(response.error.message);

    const path = response.data.visibility === 'public' ? '/recipes' : '/recipes/mine';
    navigate(`${path}/${response.data.id}`, {
      state: { success: 'Recipe updated successfully!' },
    });
  }

  return (
    <RecipeFormTemplate
      initialValues={getFormValues(recipe)}
      submitLabel="update"
      loadingLabel="updating.."
      onSubmit={submitHandler}
    />
  );
}
