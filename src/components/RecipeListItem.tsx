import type { Recipe } from '../types/recipe';

export default function RecipeListItem({ recipe }: { recipe: Recipe }) {
  return (
    <li className="flex flex-col overflow-hidden border rounded-xl border-gray-200 shadow">
      {/* Image pleacholder */}
      <div className="w-full h-64  bg-red-50/50"></div>
      <div className="flex flex-col p-2 px-4">
        <h3 className="text-2xl capitalize">{recipe.title}</h3>
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
      </div>
    </li>
  );
}
