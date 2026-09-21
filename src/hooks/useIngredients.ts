import { useEffect, useState } from 'react';

import { ingredient as ingredientApi } from '../api/ingredient';
import type { Ingredient } from '../contracts/recipe/ingredient';

export function useIngredients() {
  const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await ingredientApi.all();
        if (!res.success) throw new Error(res.error.message);
        setIngredientsList(res.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Something went wrong');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  return { ingredientsList, loading, error };
}
