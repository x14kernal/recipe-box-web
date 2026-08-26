import { type Dispatch, type SetStateAction } from 'react';
import Input from '../ui/Input';
import type { RecipeFormValues, Step } from '../../types/recipe';

type Ps = {
  steps: Step[];
  onChange: Dispatch<SetStateAction<RecipeFormValues>>;
  errors: Record<string, string>;
  onError: Dispatch<
    React.SetStateAction<{
      ingredients: Record<string, Record<string, string>>;
      steps: Record<string, string>;
      tags: Record<string, string>;
      title: string;
    }>
  >;
};

export default function StepsEditor({ steps, onChange, errors, onError }: Ps) {
  function onAdd() {
    const stepPlacholder: Step = {
      id: crypto.randomUUID(),
      description: '',
    };
    onChange((prev) => ({ ...prev, steps: [...prev.steps, stepPlacholder] }));
  }

  function onDelete(id: string) {
    onChange((prev) => {
      if (prev.steps.length === 1) {
        onError((prev) => ({ ...prev, steps: {} }));
        return {
          ...prev,
          steps: [
            {
              id: crypto.randomUUID(),
              description: '',
            },
          ],
        };
      }
      return { ...prev, steps: prev.steps.filter((item) => item.id !== id) };
    });
  }

  function onUpdate(id: string, description: string) {
    onChange((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => {
        if (s.id === id) {
          return { ...s, description };
        }
        return s;
      }),
    }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex items-start justify-between  gap-2"
          >
            <div className="flex-1 flex flex-col gap-0.5">
              <Input
                label="step"
                type="text"
                name={`steps-[${step.id}]`}
                id={`step-${step.id}`}
                value={step.description}
                onChange={(e) => {
                  onUpdate(step.id, e.target.value);
                }}
              />
              {errors[step.id] && errors[step.id].length > 0 && (
                <p className="text-red-700 text-sm">{errors[step.id]}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDelete(step.id)}
              className="flex items-center justify-center font-black w-6 h-6 border p-2 rounded-full cursor-pointer"
            >
              X
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="border px-2 py-1 cursor-pointer"
      >
        +
      </button>
    </div>
  );
}
