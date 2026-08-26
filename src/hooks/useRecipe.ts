import { useEffect, useState } from 'react';
import type { Recipe } from '../types/recipe';
import { recipes } from '../api/recipes';

export function useRecipe(id: string) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipe() {
      setLoading(true);
      setError(null);

      try {
        const res = await recipes.one(id);
        if (!res.success)
          throw new Error(`${res.error.code} ${res.error.message}`);

        setRecipe(res.data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Something went wrong!'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  return { recipe, loading, error };
}
