import type { Recipe, RecipeForm, UpdateRecipe } from '../contracts/recipe';

// API → Form
export function getFormValues(recipe?: Recipe): RecipeForm {
  if (!recipe) {
    return {
      title: '',
      servingSize: 1,
      visibility: 'public',
      ingredients: [{ name: '', quantity: 1, unit: '', image: null }],
      tags: [{ name: '' }],
      steps: [{ description: '', image: null }],
      images: [{ imageUrl: '' }],
    };
  }

  return {
    title: recipe.title,
    servingSize: recipe.servingSize,
    visibility: recipe.visibility,

    ingredients: recipe.ingredients.map(({ id, quantity, unit }) => ({ id, quantity, unit })),
    steps: recipe.steps.map(({ description, image }) => ({ description, image })),
    images: recipe.images.map(({ imageUrl }) => ({ imageUrl })),
    tags: recipe.tags.map(({ id }) => ({ id })),
  };
}

// Form → Update API
export function toUpdateRecipe(form: RecipeForm, initRecipe: Recipe): UpdateRecipe {
  const servingSizeChanged = form.servingSize !== initRecipe.servingSize;
  const visibilityChanged = form.visibility !== initRecipe.visibility;
  const titleChanged = form.title !== initRecipe.title;

  const ingredChanged =
    JSON.stringify(form.ingredients) !==
    JSON.stringify(initRecipe.ingredients.map(({ id, quantity, unit }) => ({ id, quantity, unit })));

  const stepsChanged =
    JSON.stringify(form.steps) !==
    JSON.stringify(
      initRecipe.steps.map(({ description, image }) => ({
        description,
        image: image ?? null,
      }))
    );

  const tagsChanged = JSON.stringify(form.tags) !== JSON.stringify(initRecipe.tags.map(({ id }) => ({ id })));

  const imagesChanged =
    JSON.stringify(form.images) !== JSON.stringify(initRecipe.images.map(({ imageUrl }) => ({ imageUrl })));

  return {
    ...(titleChanged && { title: form.title }),
    ...(servingSizeChanged && { servingSize: form.servingSize }),
    ...(visibilityChanged && { visibility: form.visibility }),

    ...(ingredChanged && { ingredients: form.ingredients }),
    ...(imagesChanged && { images: form.images }),
    ...(stepsChanged && { steps: form.steps }),
    ...(tagsChanged && { tags: form.tags }),
  };
}
