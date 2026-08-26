import type {
  CreateRecipe,
  Recipe,
  RecipeFormValues,
  UpdateRecipe,
} from '../types/recipe';

// API → Form
export function toFormValues(recipe?: Recipe): RecipeFormValues {
  if (!recipe) {
    return {
      title: '',
      ingredients: [
        {
          id: crypto.randomUUID(),
          quantity: 1,
          unit: '',
          item: '',
        },
      ],
      steps: [
        {
          id: crypto.randomUUID(),
          description: '',
        },
      ],
      tags: [],
    };
  }

  return {
    title: recipe.title,

    ingredients: recipe.ingredients.map((value) => {
      const [quantity, unit, ...item] = value.split(' ');

      return {
        id: crypto.randomUUID(),
        quantity: Number(quantity),
        unit,
        item: item.join(' '),
      };
    }),

    steps: recipe.steps.map((description) => ({
      id: crypto.randomUUID(),
      description,
    })),

    tags: recipe.tags.map((name) => ({
      id: crypto.randomUUID(),
      name,
    })),
  };
}

// Form → Create API
export function toCreateRecipe(values: RecipeFormValues): CreateRecipe {
  return {
    title: values.title,
    ingredients: values.ingredients.map(
      ({ quantity, unit, item }) => `${quantity} ${unit} ${item}`
    ),
    steps: values.steps.map(({ description }) => description),
    tags: values.tags.map(({ name }) => name),
  };
}

// Form → Update API
export function toUpdateRecipe(values: RecipeFormValues): UpdateRecipe {
  return {
    title: values.title,
    ingredients: values.ingredients.map(
      ({ quantity, unit, item }) => `${quantity} ${unit} ${item}`
    ),
    steps: values.steps.map(({ description }) => description),
    tags: values.tags.map(({ name }) => name),
  };
}
