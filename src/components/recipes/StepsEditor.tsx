import { type Dispatch, type SetStateAction } from 'react';
import { Plus, X } from 'lucide-react';

import type { NewRecipeStep } from '../../contracts/recipe/step';
import type { RecipeForm } from '../../contracts/recipe';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FormErrors = {
  ingredients: Record<string, Record<string, string>>;
  images: Record<string, string>;
  steps: Record<string, Record<string, string>>;
  tags: Record<string, string>;
  title: string;
  visibility: string;
  servingSize: string;
};

type StepsEditorProps = {
  recipeSteps: NewRecipeStep[];
  onChange: Dispatch<SetStateAction<RecipeForm>>;
  errors: Record<string, Record<string, string>>;
  onError: Dispatch<SetStateAction<FormErrors>>;
};

export default function StepsEditor({ recipeSteps, onChange, errors, onError }: StepsEditorProps) {
  type StepField = 'description' | 'image';

  function updateStepField(index: number, field: StepField, value: string) {
    onChange((prev) => ({
      ...prev,
      steps: prev.steps.map((step, idx) => {
        if (idx !== index) return step;

        return {
          ...step,
          [field]: value,
        };
      }),
    }));
  }

  function addNewEmptyStep() {
    onChange((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          description: '',
          image: null,
        },
      ],
    }));
  }

  function removeStep(index: number) {
    onChange((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));

    onError((prev) => {
      const steps = Object.fromEntries(
        Object.entries(prev.steps)
          .filter(([key]) => key !== String(index))
          .map(([_, value], i) => [i, value])
      );

      return {
        ...prev,
        steps,
      };
    });
  }

  return (
    <Card className="border-border/60 bg-muted/30 shadow-sm rounded-7xl">
      <CardHeader>
        <CardTitle>Instructions</CardTitle>

        <p className="text-sm text-muted-foreground">Add the steps needed to prepare your recipe.</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-4">
          {recipeSteps.map((step, index) => (
            <StepInput
              key={index}
              index={index}
              recipeStep={step}
              error={errors[index]}
              onUpdate={updateStepField}
              onRemove={removeStep}
            />
          ))}
        </div>

        <Button type="button" variant="outline" onClick={addNewEmptyStep}>
          <Plus />
          Add step
        </Button>
      </CardContent>
    </Card>
  );
}

type StepInputProps = {
  index: number;
  recipeStep: NewRecipeStep;
  error?: Record<string, string>;
  onUpdate(index: number, field: 'description' | 'image', value: string): void;
  onRemove: (index: number) => void;
};

function StepInput({ index, recipeStep, error, onUpdate, onRemove }: StepInputProps) {
  const { description, image } = recipeStep;

  return (
    <div className="relative rounded-5xl border border-border/50 p-4 pr-12 transition-colors hover:bg-muted/50 hover:shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {index + 1}
        </div>

        <div>
          <p className="font-medium">Step {index + 1}</p>
          <p className="text-xs text-muted-foreground">Describe what needs to be done.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`description-${index}`}>Description</Label>

          <Input
            id={`description-${index}`}
            name={`steps[${index}][description]`}
            type="text"
            placeholder="e.g. Heat the oil in a large pan..."
            value={description}
            onChange={(event) => onUpdate(index, 'description', event.target.value)}
          />

          {error?.description && <p className="text-sm text-destructive">{error.description}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`image-${index}`}>
            Image URL
            <span className="ml-1 text-muted-foreground">(optional)</span>
          </Label>

          <Input
            id={`image-${index}`}
            name={`steps[${index}][image]`}
            type="url"
            placeholder="https://..."
            value={image ?? ''}
            onChange={(event) => onUpdate(index, 'image', event.target.value)}
          />

          {error?.image && <p className="text-sm text-destructive">{error.image}</p>}
        </div>
      </div>

      {index > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 size-8 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(index)}
          aria-label={`Remove step ${index + 1}`}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
