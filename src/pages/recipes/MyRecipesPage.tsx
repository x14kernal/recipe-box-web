import { PageHeader } from '@/components/PageHeader';
import RecipesList from '../../components/recipes/RecipesList';

export default function MyRecipesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your recipes"
        title="My Recipes"
        description="Manage the recipes you've created and keep your collection organized."
      />

      <RecipesList type="mine" />
    </div>
  );
}
