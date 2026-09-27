import CreateRecipeForm from '../../components/recipes/CreateRecipeForm';

export default function NewRecipePage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <div className="space-y-2">
        <p className="text-primary text-sm font-medium">Recipe collection</p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Create a recipe</h1>

        <p className="text-muted-foreground max-w-2xl">
          Add the ingredients, instructions, and details needed to make your recipe easy to follow
          and share.
        </p>
      </div>

      <CreateRecipeForm />
    </div>
  );
}
