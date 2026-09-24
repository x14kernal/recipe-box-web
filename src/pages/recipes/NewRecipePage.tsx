import CreateRecipeForm from '../../components/recipes/CreateRecipeForm';

export default function NewRecipePage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Recipe collection</p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Create a recipe</h1>

        <p className="max-w-2xl text-muted-foreground">
          Add the ingredients, instructions, and details needed to make your recipe easy to follow and share.
        </p>
      </div>

      <CreateRecipeForm />
    </div>
  );
}
