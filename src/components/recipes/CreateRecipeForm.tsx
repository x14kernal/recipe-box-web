import { useNavigate } from 'react-router';
import { type RecipeForm } from '../../contracts/recipe';
import { recipe as recipeApi } from '../../api/recipe';
import { getFormValues } from '../../mappers/recipe';
import RecipeFormTemplate from './RecipeFormTemplate';

export default function CreateRecipeForm() {
  const navigate = useNavigate();

  async function submitHandler(data: RecipeForm) {
    const response = await recipeApi.create(data);
    if (!response.success) throw new Error(response.error.message);

    const path = response.data.visibility === 'public' ? '/recipes' : '/recipes/mine';

    navigate(`${path}/${response.data.id}`, {
      state: { success: 'Recipe created successfully!' },
    });
  }

  return (
    <RecipeFormTemplate
      initialValues={getFormValues()}
      submitLabel="create"
      loadingLabel="creating.."
      onSubmit={submitHandler}
    />
  );
}
