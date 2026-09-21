import type { Ingredient, RecipeIngredientInput } from '../../contracts/recipe/ingredient';
import Combobox from '../ui/Combobox';
import Input from '../ui/Input';
import { type Dispatch, type SetStateAction } from 'react';
import { useIngredients } from '../../hooks/useIngredients';
import type { RecipeForm } from '../../contracts/recipe';

type IngredientsEditorProps = {
  recipeIngredients: RecipeIngredientInput[];
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

export default function IngredientsEditor({ recipeIngredients, onChange, errors, onError }: IngredientsEditorProps) {
  const { ingredientsList, loading } = useIngredients();

  function selectIngredient(index: number, value: { id: string } | { name: string }) {
    onChange((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, idx) => {
        if (idx !== index) return ing;
        if ('id' in value) return { id: value.id, quantity: ing.quantity, unit: ing.unit };
        return { name: value.name, image: null, quantity: ing.quantity, unit: ing.unit };
      }),
    }));
  }

  type Cell = 'name' | 'image' | 'quantity' | 'unit';
  function updateIngredientField(index: number, cell: Cell, value: string | number) {
    onChange((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, idx) => {
        if (idx !== index) return ing;

        if ('name' in ing) {
          return {
            ...ing,
            ...(cell === 'name' && { name: String(value) }),
            ...(cell === 'quantity' && { quantity: Number(value) }),
            ...(cell === 'unit' && { unit: String(value) }),
            ...(cell === 'image' && { image: String(value) }),
          };
        }

        return {
          ...ing,
          ...(cell === 'quantity' && { quantity: Number(value) }),
          ...(cell === 'unit' && { unit: String(value) }),
        };
      }),
    }));
  }

  function addNewEmptyIngredient() {
    onChange((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: 1, unit: '', image: null }],
    }));
  }

  function removeIngredient(idx: number) {
    onChange((prev) => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => idx !== i) }));
    onError((prev) => {
      const ingredients = Object.fromEntries(
        Object.entries(prev.ingredients)
          .filter(([key]) => key !== String(idx))
          .map(([_, value], i) => [i, value])
      );

      return { ...prev, ingredients };
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 my-4">
        <p className="text-gray-600 text-xl">Ingredients List</p>

        {recipeIngredients.map((ing, idx) => (
          <IngredientInput
            key={idx}
            index={idx}
            recipeIngredient={ing}
            recipeIngredients={recipeIngredients}
            ingredientsList={ingredientsList}
            isIngredientsListLoading={loading}
            onSelect={selectIngredient}
            onUpdate={updateIngredientField}
            onRemove={removeIngredient}
            error={errors[idx]}
          />
        ))}
      </div>
      <button type="button" onClick={addNewEmptyIngredient} className="bg-gray-100 cursor-pointer p-1">
        Add Ingredient
      </button>
    </div>
  );
}

type IngredientInputProps = {
  index: number;
  recipeIngredient: RecipeIngredientInput;
  onUpdate(index: number, cell: 'name' | 'image' | 'quantity' | 'unit', value: string | number): void;
  onSelect(index: number, value: { id: string } | { name: string }): void;
  onRemove: (idx: number) => void;
  ingredientsList: Ingredient[];
  isIngredientsListLoading: boolean;
  recipeIngredients: RecipeIngredientInput[];
  error: Record<string, string>;
};

function IngredientInput({
  index,
  recipeIngredient,
  ingredientsList,
  isIngredientsListLoading,
  recipeIngredients,
  error,
  onUpdate,
  onSelect,
  onRemove,
}: IngredientInputProps) {
  const { quantity, unit } = recipeIngredient;

  function handleIngredientChange(value: { id: string } | { name: string } | null) {
    if (!value) return;
    onSelect(index, value);
  }

  const availableIngredients = ingredientsList.filter((ingredient) => {
    return !recipeIngredients.some((ing, idx) => idx !== index && 'id' in ing && ing.id === ingredient.id);
  });

  return (
    <div className="relative flex gap-2">
      <div className="flex flex-col gap-1">
        <Combobox
          name={`ingredients[${index}][ingredient]`}
          label="ingredient"
          id={`ingredient-${index}`}
          items={availableIngredients}
          isItemsLoading={isIngredientsListLoading}
          onChange={handleIngredientChange}
          selectedValue={recipeIngredient}
        />
        {error && error.name.length > 0 && <p className="text-sm text-red-700">{error.name}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Input
          label="quantity"
          type="number"
          name={`ingredients[${index}][quantity]`}
          id={`quantity-${index}`}
          value={quantity}
          onChange={(e) => onUpdate(index, 'quantity', Number(e.target.value))}
        />
        {error && error.quantity.length > 0 && <p className="text-sm text-red-700">{error.quantity}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Input
          label="unit"
          type="text"
          name={`ingredients[${index}][unit]`}
          id={`unit-${index}`}
          value={unit}
          onChange={(e) => onUpdate(index, 'unit', e.target.value)}
        />
        {error && error.unit.length > 0 && <p className="text-sm text-red-700">{error.unit}</p>}
      </div>

      {`name` in recipeIngredient && (
        <Input
          label="image link"
          type="url"
          name={`ingredients[${index}][image]`}
          id={`image-${index}`}
          value={recipeIngredient.image ? recipeIngredient.image : ''}
          onChange={(e) => onUpdate(index, 'image', e.target.value)}
        />
      )}

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
