import { useNavigate } from 'react-router';
import { useRecipes } from '../../hooks/useRecipes';
import RecipeListItem from './RecipeListItem';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';
import RecipeFilters from './RecipeFilters';

export default function RecipesList({ type = 'all' }: { type?: 'all' | 'mine' }) {
  const { recipesList, recipesMeta, loading, error } = useRecipes(type);
  const navigate = useNavigate();

  return (
    <div>
      {/* Filters + Pagination */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <RecipeFilters />

        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!recipesMeta.prev || loading}
            onClick={() => recipesMeta.prev && navigate(recipesMeta.prev)}
          >
            &larr; Back
          </Button>

          <Button
            variant="outline"
            disabled={!recipesMeta.next || loading}
            onClick={() => recipesMeta.next && navigate(recipesMeta.next)}
          >
            Next &rarr;
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl shadow-md shadow-orange-900/10" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Recipes */}
      {!loading && !error && recipesList.length > 0 && (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipesList.map((recipe) => (
            <RecipeListItem key={recipe.id} recipe={recipe} />
          ))}
        </ul>
      )}

      {/* Empty */}
      {!loading && !error && recipesList.length === 0 && (
        <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">No recipes found!</p>
        </div>
      )}
    </div>
  );
}
