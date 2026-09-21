import { useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import { recipe as recipeApi } from '../api/recipe';

import type { RecipeListItem } from '../contracts/recipe';
import type { Pagination } from '../contracts/pagination';

export function useRecipes(type: 'all' | 'mine' = 'all') {
  const [searchParams] = useSearchParams();

  const [recipesList, setRecipesList] = useState<RecipeListItem[]>([]);
  const [recipesMeta, setRecipesMeta] = useState<Pagination>({
    limit: 0,
    page: 0,
    total: 0,
    next: null,
    prev: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Everything after "?" in the URL
  const queryString = searchParams.toString();

  const path = type === 'all' ? '/recipes' : '/recipes/mine';

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = queryString ? `${path}?${queryString}` : path;

        const res = await recipeApi.all(url);

        if (!res.success) {
          throw new Error(res.error.message);
        }

        setRecipesList(res.data);

        if (res.meta) {
          setRecipesMeta(res.meta);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [path, queryString]);

  return {
    recipesList,
    recipesMeta,
    loading,
    error,
  };
}
