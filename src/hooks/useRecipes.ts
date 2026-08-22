import { useEffect, useState } from 'react';
import type { Recipe } from '../types/recipe';
import { recipes } from '../api/recipes';
import type { Pagination } from '../types/pagination';

export function useRecipes() {
  const [path, setPath] = useState('/recipes');
  const [recipesList, setRecipesList] = useState<Recipe[]>([]);
  const [recipesMeta, setRecipesMeta] = useState<Pagination>({
    limit: 0,
    page: 0,
    total: 0,
    next: null,
    prev: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await recipes.all(path);
        if (!res.success) throw new Error(res.error.message);
        setRecipesList(res.data);
        if (res.meta) setRecipesMeta(res.meta);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Something went wrong'
        );
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [path]);

  return { recipesList, recipesMeta, loading, error, setPath };
}
