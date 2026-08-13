import { useEffect, useState } from 'react';

/*
 * Live visitor counter backed by Firebase Realtime Database.
 *
 * The Firebase SDK is pulled in with a dynamic import rather than a top-level
 * one. Statically importing it put the entire firebase/database client into
 * the main bundle - a six-figure byte cost on the critical path for a number
 * that renders well below the fold. It now arrives in its own chunk after
 * first paint, and the counter simply shows its loading state until then.
 */
export const useViewCounter = () => {
  const [views, setViews] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    (async () => {
      try {
        const [{ ref, runTransaction, onValue }, { database }] = await Promise.all([
          import('firebase/database'),
          import('../lib/firebase.js'),
        ]);

        // The component may have unmounted while the chunk was in flight.
        if (cancelled) return;

        const viewsRef = ref(database, 'views');

        // Count one view per browsing session, not per render.
        if (!sessionStorage.getItem('innofusion_visited')) {
          runTransaction(viewsRef, (current: number | null) => (current || 0) + 1)
            .then(() => sessionStorage.setItem('innofusion_visited', 'true'))
            .catch(() => undefined);
        }

        unsubscribe = onValue(
          viewsRef,
          (snapshot) => {
            if (cancelled) return;
            setViews(snapshot.val() || 0);
            setLoading(false);
          },
          () => {
            if (!cancelled) setLoading(false);
          }
        );
      } catch {
        // Offline, blocked by an extension, or misconfigured credentials.
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return { views, loading };
};

export default useViewCounter;
