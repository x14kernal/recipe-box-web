import { Link } from 'react-router';
import type { RecipeListItem } from '../../contracts/recipe';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';

export default function RecipeListItem({ recipe }: { recipe: RecipeListItem }) {
  const recipesPath = recipe.visibility === 'public' ? `/recipes` : `/recipes/mine`;

  return (
    <Card className="flex h-full flex-col overflow-hidden pt-0 rounded-t-9xl rounded-b-7xl shadow-md shadow-orange-900/10">
      <div className="relative h-48 w-full overflow-hidden bg-muted rounded-b-8xl">
        {recipe.coverImage ? (
          <img
            src={recipe.coverImage.imageUrl}
            alt={recipe.title}
            className="size-full object-cover transition-transform duration-300 hover:scale-130"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-linear-to-br from-orange-100 via-amber-50 to-yellow-100 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950">
            <span className="text-5xl">🍳</span>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex justify-end bg-linear-to-b from-black/30 to-transparent p-3">
          <Badge variant="secondary" className="border-0 bg-background/90 shadow-sm backdrop-blur-lg">
            {recipe.servingSize}
            <span className="ml-1">{recipe.servingSize === 1 ? 'serving' : 'servings'}</span>
          </Badge>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="capitalize">
          <Link to={`${recipesPath}/${recipe.id}`}>{recipe.title}</Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-wrap gap-2">
        {recipe.tags.map(({ id, name, slug }) => (
          <Link to={`${recipesPath}?tags=${slug}`} key={id}>
            <Badge variant="secondary">{name}</Badge>
          </Link>
        ))}
      </CardContent>

      <CardFooter className="mt-auto flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarFallback>{(recipe.user.displayName ?? recipe.user.username)[0].toUpperCase()}</AvatarFallback>
          </Avatar>

          <span className="text-sm font-medium">{recipe.user.displayName ?? recipe.user.username}</span>
        </div>

        <span className="text-muted-foreground">
          {new Date(recipe.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </CardFooter>
    </Card>
  );
}
