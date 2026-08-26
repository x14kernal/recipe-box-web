import CreateRecipeForm from '../../components/recipes/CreateRecipeForm';

export default function NewRecipePage() {
  return (
    <>
      <h1 className="text-4xl p-2 mb-4">Add new recipe</h1>
      <CreateRecipeForm />
    </>
  );
}
