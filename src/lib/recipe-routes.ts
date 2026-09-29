import type { RecipesType } from '@/contracts/recipe';

export function getRecipesPath(type: RecipesType): string {
  switch (type) {
    case 'all':
      return '/recipes';
    case 'mine':
      return '/recipes/mine';
    case 'trashed':
      return '/recipes/trash';
    case 'bookmarked':
      return '/bookmarks';
  }
}
