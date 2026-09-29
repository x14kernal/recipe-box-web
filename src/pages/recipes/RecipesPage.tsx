import { Button } from '@/components/ui/button';
import RecipesList from '../../components/recipes/RecipesList';
import { Dices } from 'lucide-react';
import { useRandomRecipe } from '@/hooks/useRandomRecipe';
import { useNavigate } from 'react-router';

export default function RecipesPage() {
  const navigate = useNavigate();
  const { getRandomRecipe, loading, error } = useRandomRecipe();

  async function handleRandomRecipe() {
    const recipe = await getRandomRecipe();

    if (recipe) navigate(`/recipes/${recipe.id}`);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>

      <RecipesList />

      {/* Random Recipe */}
      <div className="flex items-center justify-between rounded-xl border p-4">
        <div>
          <h2 className="font-semibold">Can't decide?</h2>
          <p className="text-muted-foreground text-sm">Let us pick a recipe for you.</p>
        </div>

        <Button onClick={handleRandomRecipe} disabled={loading}>
          <Dices />
          {loading ? 'Choosing...' : 'Random Recipe'}
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
