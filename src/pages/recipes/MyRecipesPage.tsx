import RecipesList from '../../components/recipes/RecipesList';

export default function MyRecipesPage() {
  return (
    <>
      <h1 className="text-4xl p-2 mb-4">My Recipes</h1>
      <RecipesList type="mine" />
    </>
  );
}
