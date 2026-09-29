import RecipesList from '../../components/recipes/RecipesList';

export default function BookmarksPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>

      <RecipesList type="bookmarked" />
    </div>
  );
}
