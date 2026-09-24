import RecipesList from '../../components/recipes/RecipesList';

export default function RecipesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>

      <RecipesList />
    </div>
  );
}
