import { useEffect } from 'react';
import { useAuth } from './useAuth';

export default function useRequireAuth() {
  const { user, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, [user, authLoading]);

  return { user, authLoading };
}
