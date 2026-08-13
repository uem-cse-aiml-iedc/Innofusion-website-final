/**
 * Custom Hook: useDevfolioData
 * Fetches hackathon data from Devfolio API via Vercel Serverless Function proxy
 * This bypasses CORS issues by routing through /api/devfolio
 */

import { useState, useEffect } from 'react';

interface DevfolioData {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  starts_at?: string;
  ends_at?: string;
  registration_ends_at?: string;
  max_team_size?: number;
  min_team_size?: number;
  cover_image?: string;
  logo?: string;
  themes?: string[];
  tracks?: any[];
  prizes?: any[];
  judges?: any[];
  organisers?: any[];
  partners?: any[];
  [key: string]: any;
}

interface UseDevfolioDataReturn {
  data: DevfolioData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDevfolioData(): UseDevfolioDataReturn {
  const [data, setData] = useState<DevfolioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call our Vercel serverless function instead of Devfolio API directly
      // This works on both localhost and production (innofusion.tech)
      const response = await fetch('/api/devfolio', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error fetching Devfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
