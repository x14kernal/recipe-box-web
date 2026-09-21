import { Link } from 'react-router';
import type { RecipeListItem } from '../../contracts/recipe';

export default function RecipeListItem({ recipe }: { recipe: RecipeListItem }) {
  const recipesPath = recipe.visibility === 'public' ? `/recipes` : `/recipes/mine`;

  return (
    <li className="flex flex-col overflow-hidden border rounded-xl border-gray-200 shadow">
      {/* Image pleacholder */}
      <div className="w-full h-64 bg-red-50/50"></div>

      <div className="flex flex-col p-2 px-4">
        <Link to={`${recipesPath}/${recipe.id}`}>
          <h3 className="text-2xl capitalize">{recipe.title}</h3>
        </Link>

        <ul className="flex gap-2">
          {recipe.tags.map(({ id, name, slug }) => (
            <Link to={`${recipesPath}?tags=${slug}`} key={id}>
              <li className="text-sm text-gray-600">{name}</li>
            </Link>
          ))}
        </ul>
      </div>
    </li>
  );
}
