import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';

import { useRecipe } from '../../hooks/useRecipe';
import { useAuth } from '../../contexts/AuthContext';
import { recipe as recipeApi } from '../../api/recipe';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecipePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { recipe, loading, error } = useRecipe(id!);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const success = location.state?.success;

  async function handleDelete(id: string) {
    setLoadingDelete(true);
    setDeleteError(null);

    try {
      await recipeApi.remove(id);
      navigate('/recipes');
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete recipe');
    } finally {
      setLoadingDelete(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!recipe) {
    return (
      <Alert>
        <AlertTitle>Recipe not found</AlertTitle>
      </Alert>
    );
  }

  const isOwner = user?.id === recipe.ownerId;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link to="/recipes" className={buttonVariants({ variant: 'ghost' })}>
        <ArrowLeft />
        Back to recipes
      </Link>

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {deleteError && (
        <Alert variant="destructive">
          <AlertTitle>Delete failed</AlertTitle>
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{recipe.title}</h1>

            <p className="mt-2 text-muted-foreground">
              {recipe.servingSize} {recipe.servingSize === 1 ? 'serving' : 'servings'}
            </p>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <Link to={`/recipes/${recipe.id}/edit`} className={buttonVariants({ variant: 'outline' })}>
                <Pencil />
                Edit
              </Link>

              <Button variant="destructive" disabled={loadingDelete} onClick={() => handleDelete(recipe.id)}>
                <Trash2 />
                {loadingDelete ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {recipe.images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {recipe.images.map((image) => (
            <img
              key={image.id}
              src={image.imageUrl}
              alt={recipe.title}
              className="aspect-video w-full rounded-xl object-cover shadow-md"
            />
          ))}
        </div>
      )}

      {/* Ingredients */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Ingredients</h2>

        <ul className="grid gap-2 sm:grid-cols-2">
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.id} className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
              <span>{ingredient.name}</span>

              <span className="text-sm text-muted-foreground">
                {ingredient.quantity} {ingredient.unit}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Separator />

      {/* Instructions */}
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Instructions</h2>

        <ol className="space-y-6">
          {recipe.steps.map((step) => (
            <li key={step.id} className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {step.position}
              </div>

              <div className="flex-1 space-y-3">
                <p className="leading-7 text-foreground/90">{step.description}</p>

                {step.image && (
                  <img
                    src={step.image}
                    alt={`Step ${step.position}`}
                    className="max-h-80 w-full rounded-xl object-cover"
                  />
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex items-center gap-3 border-t pt-6 text-sm text-muted-foreground">
        <div className="flex size-9 items-center justify-center rounded-full bg-muted font-medium text-foreground">
          {(recipe.user.displayName ?? recipe.user.username)[0].toUpperCase()}
        </div>

        <span>
          By <strong className="text-foreground">{recipe.user.displayName ?? recipe.user.username}</strong>
        </span>
      </div>
    </div>
  );
}
