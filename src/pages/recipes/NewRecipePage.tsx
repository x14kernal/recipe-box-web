import { PageHeader } from '@/components/PageHeader';
import CreateRecipeForm from '../../components/recipes/CreateRecipeForm';

export default function NewRecipePage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <PageHeader
        eyebrow="Recipe collection"
        title="Create a recipe"
        description="Add the ingredients, instructions, and details needed to make your recipe easy to follow and share."
      />

      <CreateRecipeForm />
    </div>
  );
}
