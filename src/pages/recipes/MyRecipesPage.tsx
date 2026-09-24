import RecipesList from '../../components/recipes/RecipesList';

export default function MyRecipesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">My Recipes</h1>

      <RecipesList type="mine" />
    </div>
  );
}
