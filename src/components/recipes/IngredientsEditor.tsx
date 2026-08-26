import { type Dispatch, type SetStateAction } from 'react';
import Input from '../ui/Input';
import type {
  IngredientFields,
  Ingredient,
  FormCreateRecipe,
} from '../../types/recipe';

type Ps = {
  ingredients: Ingredient[];
  onChange: Dispatch<SetStateAction<FormCreateRecipe>>;
  errors: Record<string, Record<string, string>>;
  onError: Dispatch<
    React.SetStateAction<{
      ingredients: Record<string, Record<string, string>>;
      steps: Record<string, string>;
      tags: Record<string, string>;
      title: string;
    }>
  >;
};

export default function IngredientsEditor({
  ingredients,
  onChange,
  errors,
  onError,
}: Ps) {
  function onAdd() {
    const newEmptyIng = {
      id: crypto.randomUUID(),
      quantity: 1,
      unit: '',
      item: '',
    };
    onChange((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, newEmptyIng],
    }));
  }

  function onDelete(id: string) {
    onChange((prev) => {
      if (prev.ingredients.length === 1) {
        onError((prev) => ({ ...prev, ingredients: {} }));
        return {
          ...prev,
          ingredients: [
            {
              id: crypto.randomUUID(),
              quantity: 1,
              unit: '',
              item: '',
            },
          ],
        };
      }
      return {
        ...prev,
        ingredients: prev.ingredients.filter((item) => item.id !== id),
      };
    });
  }

  function onUpdate(
    id: string,
    cell: keyof IngredientFields,
    value: string | number
  ) {
    onChange((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((item) => {
        if (item.id === id) {
          return { ...item, [cell]: value };
        }
        return item;
      }),
    }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {ingredients.map((ing) => (
          <Ingredient
            key={ing.id}
            ing={ing}
            onDelete={onDelete}
            onUpdate={onUpdate}
            error={errors[ing.id]}
          />
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

type IngredientProps = {
  ing: Ingredient;
  error: Record<string, string>;
  onDelete(id: string): void;
  onUpdate(
    id: string,
    cell: keyof IngredientFields,
    value: string | number
  ): void;
};

function Ingredient({ ing, onDelete, onUpdate, error }: IngredientProps) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 flex flex-col gap-0.5">
        <Input
          label="quantity"
          type="number"
          name={`ingredients[${ing.id}][quantity]`}
          id={`quantity-${ing.id}`}
          value={ing.quantity}
          onChange={(e) => {
            onUpdate(ing.id, 'quantity', Number(e.target.value));
          }}
        />
        {error && error.quantity.length > 0 && (
          <p className="text-red-700 text-sm">{error.quantity}</p>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-0.5">
        <Input
          label="unit"
          type="text"
          name={`ingredients[${ing.id}][unit]`}
          id={`unit-${ing.id}`}
          value={ing.unit}
          onChange={(e) => {
            onUpdate(ing.id, 'unit', e.target.value);
          }}
        />
        {error && error.unit.length > 0 && (
          <p className="text-red-700 text-sm">{error.unit}</p>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-0.5">
        <Input
          label="item"
          type="text"
          name={`ingredients[${ing.id}][item]`}
          id={`item-${ing.id}`}
          value={ing.item}
          onChange={(e) => {
            onUpdate(ing.id, 'item', e.target.value);
          }}
        />
        {error && error.item.length > 0 && (
          <p className="text-red-700 text-sm">{error.item}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDelete(ing.id)}
        className="flex items-center justify-center font-black w-6 h-6 border p-2 rounded-full cursor-pointer"
      >
        X
      </button>
    </div>
  );
}
