import { useEffect, useState } from 'react';

import { tag as tagApi } from '../api/tag';
import type { Tag } from '../contracts/recipe/tag';

export function useTags() {
  const [tagsList, setTagsList] = useState<Tag[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await tagApi.all();
        if (!res.success) throw new Error(res.error.message);
        setTagsList(res.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Something went wrong');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tagsList, loading, error };
}
