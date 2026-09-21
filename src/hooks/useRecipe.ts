import { useEffect, useState } from 'react';
import { recipe as recipeApi } from '../api/recipe';
import type { Recipe } from '../contracts/recipe';

export function useRecipe(id: string, type: 'all' | 'mine' = 'all') {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipe() {
      setLoading(true);
      setError(null);

      try {
        const res = await recipeApi.one(id, `${type === 'mine' ? '/recipes/mine' : '/recipes'}`);
        if (!res.success) throw new Error(`${res.error.code} ${res.error.message}`);

        setRecipe(res.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Something went wrong!');
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id, type]);

  return { recipe, loading, error };
}
