import { PageHeader } from '@/components/PageHeader';
import RecipesList from '../../components/recipes/RecipesList';

export default function MyTrashedRecipesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your recipes"
        title="Trashed Recipes"
        description="Recipes you've moved to the trash. Restore them or will be removed permanently."
      />

      <RecipesList type="trashed" />
    </div>
  );
}
