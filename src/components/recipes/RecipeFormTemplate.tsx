import z from 'zod';
import { useState, type SubmitEvent } from 'react';

import { recipeFormSchema, type CreateRecipe, type RecipeForm } from '../../contracts/recipe';

import { getZodError } from '../../lib/zod';
import IngredientsEditor from './IngredientsEditor';
import StepsEditor from './StepsEditor';
import TagsEditor from './TagsEditor';
import { Form } from '../ui/Form';
import { getFormValues } from '../../mappers/recipe';
import ImagesEditor from './ImagesEditor';

type FormErrors = {
  ingredients: Record<string, Record<string, string>>;
  images: Record<string, string>;
  steps: Record<string, Record<string, string>>;
  tags: Record<string, string>;
  title: string;
  visibility: string;
  servingSize: string;
};

type RecipeFormProps = {
  initialValues: RecipeForm;
  submitLabel: string;
  loadingLabel: string;
  onSubmit: (recipe: RecipeForm) => Promise<void>;
  onSuccess?: () => void;
};

export default function RecipeFormTemplate({
  initialValues,
  submitLabel,
  loadingLabel,
  onSubmit,
  onSuccess,
}: RecipeFormProps) {
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    ingredients: {},
    images: {},
    steps: {},
    tags: {},
    title: '',
    visibility: '',
    servingSize: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submitHandler(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError('');
    resetErrors();

    const result = z.safeParse(recipeFormSchema, formData);

    if (!result.success) {
      setFormErrors(getFormErrors(result.error.issues, formData));
      setLoading(false);
      return;
    }

    try {
      await onSubmit(result.data);
      onSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong!');
      setFormData(getFormValues()); // if success it'll redirect so I don't think I need to reset form
    } finally {
      setLoading(false);
    }
  }

  function resetErrors() {
    setFormErrors({ ingredients: {}, images: {}, steps: {}, tags: {}, title: '', visibility: '', servingSize: '' });
  }

  return (
    <div className="flex flex-col gap-8">
      {error && <p className="text-red-700">{error}</p>}

      <Form onSubmit={submitHandler}>
        <div className="flex flex-col">
          <Form.Input
            type="text"
            label="title"
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          />
          {formErrors.title && formErrors.title.length > 0 && (
            <p className="text-sm text-red-700">{formErrors.title}</p>
          )}
        </div>

        <div className="flex flex-col">
          <Form.Input
            type="number"
            min={1}
            label="Serving Size"
            id="servingSize"
            name="servingSize"
            value={formData.servingSize}
            onChange={(e) => setFormData((prev) => ({ ...prev, servingSize: Number(e.target.value) }))}
          />
          {formErrors.servingSize && formErrors.servingSize.length > 0 && (
            <p className="text-sm text-red-700">{formErrors.servingSize}</p>
          )}
        </div>

        {/* Visibility */}
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="visibility" className="capitalize">
            visibility
          </label>
          <select
            id="visibility"
            name="visibility"
            className="border px-2 py-1 rounded"
            value={formData.visibility}
            onChange={(e) => setFormData((prev) => ({ ...prev, visibility: e.target.value as 'public' | 'private' }))}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Ingredients Editor */}
        <IngredientsEditor
          recipeIngredients={formData.ingredients}
          onChange={setFormData}
          errors={formErrors.ingredients}
          onError={setFormErrors}
        />

        {/* Steps Editor */}
        <StepsEditor
          recipeSteps={formData.steps}
          onChange={setFormData}
          errors={formErrors.steps}
          onError={setFormErrors}
        />

        {/* Tags Editor */}
        <TagsEditor
          recipeTags={formData.tags}
          onChange={setFormData}
          errors={formErrors.tags}
          onError={setFormErrors}
        />

        {/* Images Editor */}
        <ImagesEditor
          recipeImages={formData.images}
          onChange={setFormData}
          errors={formErrors.images}
          onError={setFormErrors}
        />

        <Form.SubmitButton isLoading={loading}>{loading ? loadingLabel : submitLabel}</Form.SubmitButton>
      </Form>
    </div>
  );
}

function getFormErrors(issues: z.ZodError['issues'], { ingredients, steps, tags, images }: CreateRecipe): FormErrors {
  const ingredientErrors = ingredients.reduce<Record<string, Record<string, string>>>((errors, _, i) => {
    errors[i] = {
      quantity: getZodError(issues, 'ingredients', i, 'quantity'),
      unit: getZodError(issues, 'ingredients', i, 'unit'),
      name: getZodError(issues, 'ingredients', i, 'name'),
    };
    return errors;
  }, {});

  const stepErrors = steps.reduce<Record<string, Record<string, string>>>((errors, _, i) => {
    errors[i] = {
      description: getZodError(issues, 'steps', i, 'description'),
      image: getZodError(issues, 'steps', i, 'image'),
    };
    return errors;
  }, {});

  const tagErrors = tags.reduce((errors, _, i) => ({ ...errors, [i]: getZodError(issues, 'tags', i) }), {});

  const imageErrors = images.reduce((errors, _, i) => ({ ...errors, [i]: getZodError(issues, 'images', i) }), {});

  return {
    servingSize: getZodError(issues, 'servingSize'),
    visibility: getZodError(issues, 'visibility'),
    title: getZodError(issues, 'title'),
    ingredients: ingredientErrors,
    images: imageErrors,
    steps: stepErrors,
    tags: tagErrors,
  };
}
