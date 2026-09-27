import RecipesList from '../../components/recipes/RecipesList';

export default function MyTrashedRecipesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Trashed Recipes</h1>

      <RecipesList type="trashed" />
    </div>
  );
}
