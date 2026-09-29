import { useState } from 'react';

import { recipe as recipeApi } from '../api/recipe';
import type { Recipe } from '../contracts/recipe';

export function useRandomRecipe() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getRandomRecipe() {
    setLoading(true);
    setError(null);

    try {
      const res = await recipeApi.random();
      if (!res.success) throw new Error(`${res.error.code} ${res.error.message}`);

      setRecipe(res.data);
      return res.data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  }

  return { recipe, loading, error, getRandomRecipe };
}
