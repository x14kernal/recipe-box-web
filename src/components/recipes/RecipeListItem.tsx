import { Link } from 'react-router';
import type { Recipe } from '../../types/recipe';
type Ps = {
  recipe: Recipe;
  isOwner: boolean;
};

export default function RecipeListItem({ recipe, isOwner }: Ps) {
  return (
    <li className="flex flex-col overflow-hidden border rounded-xl border-gray-200 shadow">
      {/* Image pleacholder */}
      <div className="w-full h-64  bg-red-50/50"></div>
      <div className="flex flex-col p-2 px-4">
        <Link to={`/recipes/${recipe.id}`}>
          <h3 className="text-2xl capitalize">{recipe.title}</h3>
        </Link>
        <ul>
          <p className="text-orange-700">ingredients:</p>
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx} className="text-sm text-gray-600">
              {ing}
            </li>
          ))}
        </ul>
        <ul>
          <p className="text-orange-700">steps:</p>
          {recipe.steps.map((ing, idx) => (
            <li key={idx} className="text-sm text-gray-600">
              {ing}
            </li>
          ))}
        </ul>

        {isOwner && (
          <div className="flex gap-4 mt-2 border-t border-gray-300">
            <Link to={`/recipes/${recipe.id}/edit`}>Edit</Link>
          </div>
        )}
      </div>
    </li>
  );
}
