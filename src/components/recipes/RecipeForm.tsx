import z from 'zod';
import { useState, type SubmitEvent } from 'react';
import type { RecipeFormValues } from '../../types/recipe';
import { recipeFormSchema } from '../../schemas/recipe.schema';
import { Form } from '../ui/Form';
import { getZodError } from '../../lib/zod';
import IngredientsEditor from './IngredientsEditor';
import StepsEditor from './StepsEditor';
import TagsEditor from './TagsEditor';
import { toFormValues } from '../../mappers/recipe';

type FormErrors = {
  ingredients: Record<string, Record<string, string>>;
  steps: Record<string, string>;
  tags: Record<string, string>;
  title: string;
};

type RecipeFormProps = {
  initialValues: RecipeFormValues;
  submitLabel: string;
  loadingLabel: string;
  onSubmit: (recipe: RecipeFormValues) => Promise<void>;
  onSuccess?: () => void;
};

export default function RecipeForm({
  initialValues,
  submitLabel,
  loadingLabel,
  onSubmit,
  onSuccess,
}: RecipeFormProps) {
  const [form, setForm] = useState(initialValues);

  const [formErrors, setFormErrors] = useState<FormErrors>({
    ingredients: {},
    steps: {},
    tags: {},
    title: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submitHandler(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError('');
    setFormErrors({
      ingredients: {},
      steps: {},
      tags: {},
      title: '',
    });

    const result = z.safeParse(recipeFormSchema, form);

    if (!result.success) {
      setFormErrors(getFormErrors(result.error.issues, form));
      setLoading(false);
      return;
    }

    try {
      await onSubmit(result.data);
      onSuccess?.();
      setForm(toFormValues());
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Something went wrong!'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {error && <p className="text-red-700">{error}</p>}

      <Form onSubmit={submitHandler}>
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>

          <div className="flex flex-col gap-0.5">
            <Form.Input
              label="Title"
              name="title"
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, title: e.target.value }));
              }}
            />
            {formErrors.title && formErrors.title.length > 0 && (
              <p className="text-sm text-red-700">{formErrors.title}</p>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Ingredients</h2>
          <IngredientsEditor
            ingredients={form.ingredients}
            onChange={setForm}
            errors={formErrors.ingredients}
            onError={setFormErrors}
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Steps</h2>
          <StepsEditor
            steps={form.steps}
            onChange={setForm}
            errors={formErrors.steps}
            onError={setFormErrors}
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Tags</h2>
          <TagsEditor
            tags={form.tags}
            onChange={setForm}
            errors={formErrors.tags}
            onError={setFormErrors}
          />
        </section>

        <Form.SubmitButton isLoading={loading}>
          {loading ? loadingLabel : submitLabel}
        </Form.SubmitButton>
      </Form>
    </div>
  );
}

function getFormErrors(
  issues: z.ZodError['issues'],
  { ingredients, steps, tags }: RecipeFormValues
): FormErrors {
  const ingredientErrors = ingredients.reduce<
    Record<string, Record<string, string>>
  >((errors, ingredient, i) => {
    errors[ingredient.id] = {
      quantity: getZodError(issues, 'ingredients', i, 'quantity'),
      unit: getZodError(issues, 'ingredients', i, 'unit'),
      item: getZodError(issues, 'ingredients', i, 'item'),
    };
    return errors;
  }, {});

  const stepsErrors = steps.reduce(
    (errors, step, i) => ({
      ...errors,
      [step.id]: getZodError(issues, 'steps', i),
    }),
    {}
  );

  const tagsErrors = tags.reduce(
    (errors, tag, i) => ({
      ...errors,
      [tag.id]: getZodError(issues, 'tags', i),
    }),
    {}
  );

  return {
    title: getZodError(issues, 'title'),
    ingredients: ingredientErrors,
    steps: stepsErrors,
    tags: tagsErrors,
  };
}
