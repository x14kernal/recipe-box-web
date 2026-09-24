import z from 'zod';
import { useState, type SubmitEvent } from 'react';

import { recipeFormSchema, type CreateRecipe, type RecipeForm } from '../../contracts/recipe';

import { getZodError } from '../../lib/zod';

import IngredientsEditor from './IngredientsEditor';
import StepsEditor from './StepsEditor';
import TagsEditor from './TagsEditor';
import ImagesEditor from './ImagesEditor';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    } finally {
      setLoading(false);
    }
  }

  function resetErrors() {
    setFormErrors({
      ingredients: {},
      images: {},
      steps: {},
      tags: {},
      title: '',
      visibility: '',
      servingSize: '',
    });
  }

  return (
    <form onSubmit={submitHandler} className="space-y-10">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Recipe details */}
      <Card className="border-border/60 bg-muted/30 shadow-sm rounded-7xl">
        <CardHeader>
          <CardTitle>Recipe details</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Creamy garlic chicken"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />

            {formErrors.title && <p className="text-sm text-destructive">{formErrors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="servingSize">Serving size</Label>

            <Input
              id="servingSize"
              name="servingSize"
              type="number"
              min={1}
              value={formData.servingSize}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  servingSize: Number(e.target.value),
                }))
              }
            />

            {formErrors.servingSize && <p className="text-sm text-destructive">{formErrors.servingSize}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>

            <Select
              value={formData.visibility}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  visibility: value as 'public' | 'private',
                }))
              }
            >
              <SelectTrigger id="visibility" className="w-full">
                <SelectValue placeholder="Choose visibility" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>

            {formErrors.visibility && <p className="text-sm text-destructive">{formErrors.visibility}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <IngredientsEditor
        recipeIngredients={formData.ingredients}
        onChange={setFormData}
        errors={formErrors.ingredients}
        onError={setFormErrors}
      />

      {/* Instructions */}
      <StepsEditor
        recipeSteps={formData.steps}
        onChange={setFormData}
        errors={formErrors.steps}
        onError={setFormErrors}
      />

      {/* Tags */}
      <TagsEditor recipeTags={formData.tags} onChange={setFormData} errors={formErrors.tags} onError={setFormErrors} />

      {/* Photos */}

      <ImagesEditor
        recipeImages={formData.images}
        onChange={setFormData}
        errors={formErrors.images}
        onError={setFormErrors}
      />

      <div className="flex justify-end border-t pt-6">
        <Button type="submit" disabled={loading} className="min-w-36">
          {loading ? loadingLabel : submitLabel}
        </Button>
      </div>
    </form>
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

  const tagErrors = tags.reduce(
    (errors, _, i) => ({
      ...errors,
      [i]: getZodError(issues, 'tags', i),
    }),
    {}
  );

  const imageErrors = images.reduce(
    (errors, _, i) => ({
      ...errors,
      [i]: getZodError(issues, 'images', i),
    }),
    {}
  );

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
