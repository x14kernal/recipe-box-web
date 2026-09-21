import { type Dispatch, type SetStateAction } from 'react';
import type { NewRecipeStep } from '../../contracts/recipe/step';
import Input from '../ui/Input';
import type { RecipeForm } from '../../contracts/recipe';

type StepsEditorProps = {
  recipeSteps: NewRecipeStep[];
  onChange: Dispatch<SetStateAction<RecipeForm>>;
  errors: Record<string, Record<string, string>>;
  onError: Dispatch<
    SetStateAction<{
      ingredients: Record<string, Record<string, string>>;
      images: Record<string, string>;
      steps: Record<string, Record<string, string>>;
      tags: Record<string, string>;
      title: string;
      visibility: string;
      servingSize: string;
    }>
  >;
};

export default function StepsEditor({ recipeSteps, onChange, errors, onError }: StepsEditorProps) {
  type Cell = 'description' | 'image';
  function updateStepField(index: number, cell: Cell, value: string) {
    onChange((prev) => ({
      ...prev,
      steps: prev.steps.map((step, idx) => {
        if (idx !== index) return step;
        return { ...step, [cell]: value };
      }),
    }));
  }

  function addNewEmptyStep() {
    onChange((prev) => ({ ...prev, steps: [...prev.steps, { description: '', image: null }] }));
  }

  function removeStep(idx: number) {
    onChange((prev) => ({ ...prev, steps: prev.steps.filter((_, i) => idx !== i) }));
    onError((prev) => {
      const steps = Object.fromEntries(
        Object.entries(prev.steps)
          .filter(([key]) => key !== String(idx))
          .map(([_, value], i) => [i, value])
      );

      return { ...prev, steps };
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 my-4">
        <p className="text-gray-600 text-xl">Steps List</p>

        {recipeSteps.map((ing, idx) => (
          <StepInput
            key={idx}
            index={idx}
            recipeStep={ing}
            error={errors[idx]}
            onUpdate={updateStepField}
            onRemove={removeStep}
          />
        ))}
      </div>
      <button type="button" onClick={addNewEmptyStep} className="bg-gray-100 cursor-pointer p-1">
        Add Step
      </button>
    </div>
  );
}

type StepInputProps = {
  index: number;
  recipeStep: NewRecipeStep;
  error: Record<string, string>;
  onUpdate(index: number, cell: 'description' | 'image', value: string): void;
  onRemove: (idx: number) => void;
};

function StepInput({ index, recipeStep, error, onUpdate, onRemove }: StepInputProps) {
  const { description, image } = recipeStep;
  return (
    <div className="relative flex gap-2">
      <div className="flex flex-col gap-1">
        <Input
          label="description"
          type="text"
          name={`steps[${index}][description]`}
          id={`description-${index}`}
          value={description}
          onChange={(e) => onUpdate(index, 'description', e.target.value)}
        />
        {error && error.description.length > 0 && <p className="text-sm text-red-700">{error.description}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Input
          label="image link"
          type="text"
          name={`steps[${index}][image]`}
          id={`image-${index}`}
          value={image ?? ''}
          onChange={(e) => onUpdate(index, 'image', e.target.value)}
        />
        {error && error.image.length > 0 && <p className="text-sm text-red-700">{error.image}</p>}
      </div>

      {index > 0 && (
        <button
          type="button"
          className="absolute right-0 border p-2 w-5 h-5 flex items-center justify-center text-xs rounded-full hover:bg-red-200 cursor-pointer border-red-400"
          onClick={() => onRemove(index)}
        >
          x
        </button>
      )}
    </div>
  );
}
