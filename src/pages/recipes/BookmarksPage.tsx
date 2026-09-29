import { PageHeader } from '@/components/PageHeader';
import RecipesList from '../../components/recipes/RecipesList';

export default function BookmarksPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Saved recipes" title="Bookmarks" description="Recipes you've saved to come back to later." />

      <RecipesList type="bookmarked" />
    </div>
  );
}
