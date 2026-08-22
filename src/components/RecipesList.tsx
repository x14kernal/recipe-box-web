import { useRecipes } from '../hooks/useRecipes';
import RecipeListItem from './RecipeListItem';

export default function RecipesList() {
  const { recipesList, recipesMeta, loading, error, setPath } = useRecipes();
  return (
    <div>
      <div className="container mx-auto">
        <div className="flex justify-end items-center gap-2">
          <button
            className="border px-2 py-1 bg-green-600 text-green-100 hover:bg-green-900 cursor-pointer hover:text-green-100 disabled:cursor-not-allowed disabled:bg-red-900 disabled:text-red-50"
            disabled={!recipesMeta.prev || loading}
            onClick={() => recipesMeta.prev && setPath(recipesMeta.prev)}
          >
            &larr; Back
          </button>

          <button
            className="border px-2 py-1 bg-green-600 text-green-100 hover:bg-green-900 cursor-pointer hover:text-green-100 disabled:cursor-not-allowed disabled:bg-red-900 disabled:text-red-50"
            disabled={!recipesMeta.next || loading}
            onClick={() => recipesMeta.next && setPath(recipesMeta.next)}
          >
            Next &rarr;
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {loading && <p className="text-2xl p-4 text-gray-500">Loading...</p>}
          {error && (
            <p className="text-2xl p-4 bg-red-50 text-red-950">{error}</p>
          )}
          {!loading && recipesList.length > 0 && (
            <>
              <h2 className="text-lg underline underline-offset-2">
                All Recipes
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {recipesList.map((recipe) => (
                  <RecipeListItem key={recipe.id} recipe={recipe} />
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
