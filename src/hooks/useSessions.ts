import { useCallback, useEffect, useState } from 'react';

import type { Session } from '@/contracts/session';
import { session as sessionApi } from '../api/session';

export function useSessions() {
  const [sessionsList, setSessionsList] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await sessionApi.all();

      if (!res.success) throw new Error(res.error.message);

      setSessionsList(res.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessionsList,
    loading,
    error,
    refetch: fetchSessions,
  };
}
