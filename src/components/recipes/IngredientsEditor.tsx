import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from 'react';
import { Check, Plus, X } from 'lucide-react';

import type { Ingredient, RecipeIngredientInput } from '../../contracts/recipe/ingredient';
import type { RecipeForm } from '../../contracts/recipe';

import { useIngredients } from '../../hooks/useIngredients';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type FormErrors = {
  ingredients: Record<string, Record<string, string>>;
  images: Record<string, string>;
  steps: Record<string, Record<string, string>>;
  tags: Record<string, string>;
  title: string;
  visibility: string;
  servingSize: string;
};

type IngredientsEditorProps = {
  recipeIngredients: RecipeIngredientInput[];
  onChange: Dispatch<SetStateAction<RecipeForm>>;
  errors: Record<string, Record<string, string>>;
  onError: Dispatch<SetStateAction<FormErrors>>;
};

export default function IngredientsEditor({ recipeIngredients, onChange, errors, onError }: IngredientsEditorProps) {
  const { ingredientsList, loading } = useIngredients();

  function selectIngredient(index: number, value: { id: string } | { name: string }) {
    onChange((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, idx) => {
        if (idx !== index) return ingredient;

        if ('id' in value) {
          return {
            id: value.id,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          };
        }

        return {
          name: value.name,
          image: null,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        };
      }),
    }));
  }

  type IngredientField = 'name' | 'image' | 'quantity' | 'unit';

  function updateIngredientField(index: number, field: IngredientField, value: string | number) {
    onChange((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, idx) => {
        if (idx !== index) return ingredient;

        if ('name' in ingredient) {
          return {
            ...ingredient,
            ...(field === 'name' && { name: String(value) }),
            ...(field === 'quantity' && { quantity: Number(value) }),
            ...(field === 'unit' && { unit: String(value) }),
            ...(field === 'image' && { image: String(value) }),
          };
        }

        return {
          ...ingredient,
          ...(field === 'quantity' && { quantity: Number(value) }),
          ...(field === 'unit' && { unit: String(value) }),
        };
      }),
    }));
  }

  function addNewEmptyIngredient() {
    onChange((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          name: '',
          quantity: 1,
          unit: '',
          image: null,
        },
      ],
    }));
  }

  function removeIngredient(index: number) {
    onChange((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));

    onError((prev) => {
      const ingredients = Object.fromEntries(
        Object.entries(prev.ingredients)
          .filter(([key]) => key !== String(index))
          .map(([_, value], i) => [i, value])
      );

      return {
        ...prev,
        ingredients,
      };
    });
  }

  return (
    <Card className="border-border/60 bg-muted/30 shadow-sm rounded-7xl">
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
        <p className="text-sm text-muted-foreground">Add the ingredients and quantities needed for this recipe.</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {recipeIngredients.map((ingredient, index) => (
          <IngredientInput
            key={index}
            index={index}
            recipeIngredient={ingredient}
            recipeIngredients={recipeIngredients}
            ingredientsList={ingredientsList}
            isIngredientsListLoading={loading}
            onSelect={selectIngredient}
            onUpdate={updateIngredientField}
            onRemove={removeIngredient}
            error={errors[index]}
          />
        ))}

        <Button type="button" variant="outline" onClick={addNewEmptyIngredient}>
          <Plus />
          Add ingredient
        </Button>
      </CardContent>
    </Card>
  );
}

type IngredientInputProps = {
  index: number;
  recipeIngredient: RecipeIngredientInput;
  onUpdate(index: number, field: 'name' | 'image' | 'quantity' | 'unit', value: string | number): void;
  onSelect(index: number, value: { id: string } | { name: string }): void;
  onRemove: (index: number) => void;
  ingredientsList: Ingredient[];
  isIngredientsListLoading: boolean;
  recipeIngredients: RecipeIngredientInput[];
  error?: Record<string, string>;
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

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const availableIngredients = useMemo(() => {
    return ingredientsList.filter((ingredient) => {
      return !recipeIngredients.some(
        (selectedIngredient, selectedIndex) =>
          selectedIndex !== index && 'id' in selectedIngredient && selectedIngredient.id === ingredient.id
      );
    });
  }, [ingredientsList, recipeIngredients, index]);

  const filteredIngredients = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return availableIngredients;
    }

    return availableIngredients.filter((ingredient) => ingredient.name.toLowerCase().includes(value));
  }, [availableIngredients, search]);

  const selectedId = 'id' in recipeIngredient ? recipeIngredient.id : undefined;

  const selectedName = 'name' in recipeIngredient ? recipeIngredient.name : undefined;

  const selectedIngredient = selectedId
    ? ingredientsList.find((ingredient) => ingredient.id === selectedId)
    : undefined;

  const currentValue = selectedId ?? selectedName ?? '';

  const showCreate = !isIngredientsListLoading && search.trim().length > 0 && filteredIngredients.length === 0;

  useEffect(() => {
    if ('name' in recipeIngredient) {
      setSearch(recipeIngredient.name);
      return;
    }

    if ('id' in recipeIngredient) {
      const ingredient = ingredientsList.find((item) => item.id === recipeIngredient.id);

      setSearch(ingredient?.name ?? '');
    }
  }, [recipeIngredient, ingredientsList]);

  function handleSelect(value: string | null) {
    if (!value) return;

    const ingredient = ingredientsList.find((item) => item.id === value);

    if (!ingredient) return;

    onSelect(index, { id: ingredient.id });
    setSearch(ingredient.name);
    setOpen(false);
  }

  function handleCreate() {
    const name = search.trim();

    if (!name) return;

    onSelect(index, { name });
    setSearch(name);
    setOpen(false);
  }

  return (
    <div className="relative rounded-5xl border border-border/50 p-4 pr-12 transition-colors hover:bg-muted/50 hover:shadow-sm">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(100px,0.75fr)_minmax(120px,1fr)]">
        <div className="space-y-2">
          <Label htmlFor={`ingredient-${index}`}>Ingredient</Label>

          <Combobox value={currentValue} onValueChange={handleSelect} open={open} onOpenChange={setOpen}>
            <ComboboxInput
              id={`ingredient-${index}`}
              name={`ingredients[${index}][ingredient]`}
              placeholder="Select or create ingredient"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setOpen(true);
              }}
              showTrigger
              showClear
            />

            <ComboboxContent>
              <ComboboxList>
                {isIngredientsListLoading && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">Loading ingredients...</div>
                )}

                {!isIngredientsListLoading &&
                  filteredIngredients.map((ingredient) => (
                    <ComboboxItem key={ingredient.id} value={ingredient.id}>
                      <span className="capitalize">{ingredient.name}</span>

                      {selectedIngredient?.id === ingredient.id && <Check className="ml-auto size-4" />}
                    </ComboboxItem>
                  ))}

                {!isIngredientsListLoading && filteredIngredients.length === 0 && !showCreate && (
                  <ComboboxEmpty>No ingredients found.</ComboboxEmpty>
                )}

                {showCreate && (
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-medium hover:bg-accent"
                    onClick={handleCreate}
                  >
                    <Plus className="size-4" />
                    Create "{search.trim()}"
                  </button>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          {error?.name && <p className="text-sm text-destructive">{error.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`quantity-${index}`}>Quantity</Label>

          <Input
            type="number"
            min={0}
            name={`ingredients[${index}][quantity]`}
            id={`quantity-${index}`}
            value={quantity}
            onChange={(event) => onUpdate(index, 'quantity', Number(event.target.value))}
          />

          {error?.quantity && <p className="text-sm text-destructive">{error.quantity}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`unit-${index}`}>Unit</Label>

          <Input
            type="text"
            name={`ingredients[${index}][unit]`}
            id={`unit-${index}`}
            value={unit}
            placeholder="e.g. g, ml, tbsp"
            onChange={(event) => onUpdate(index, 'unit', event.target.value)}
          />

          {error?.unit && <p className="text-sm text-destructive">{error.unit}</p>}
        </div>
      </div>

      {'name' in recipeIngredient && (
        <div className="mt-4 space-y-2">
          <Label htmlFor={`image-${index}`}>Ingredient image URL</Label>

          <Input
            type="url"
            name={`ingredients[${index}][image]`}
            id={`image-${index}`}
            value={recipeIngredient.image ?? ''}
            placeholder="https://..."
            onChange={(event) => onUpdate(index, 'image', event.target.value)}
          />

          {error?.image && <p className="text-sm text-destructive">{error.image}</p>}
        </div>
      )}

      {index > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 size-8 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(index)}
          aria-label={`Remove ingredient ${index + 1}`}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
