import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { recipe as recipeApi } from '../api/recipe';
import { bookmark as bookmarkApi } from '../api/bookmark';
import type { Pagination } from '../contracts/pagination';
import type { RecipeListItem, RecipesType } from '../contracts/recipe';
import { getRecipesPath } from '@/lib/recipe-routes';

export function useRecipes(type: RecipesType = 'all') {
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

  const path = getRecipesPath(type);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = queryString ? `${path}?${queryString}` : path;

        let res = null;

        if (type === 'bookmarked') res = await bookmarkApi.all(url);
        else res = await recipeApi.all(url);

        if (!res.success) {
          throw new Error(res.error.message);
        }

        setRecipesList(res.data);

        if (res.meta) {
          setRecipesMeta(res.meta);
        }
        return res.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [path, queryString, type]);

  return {
    recipesList,
    recipesMeta,
    loading,
    error,
  };
}
