/**
 * Example Component: DevfolioStats
 * 
 * This demonstrates how to use the Devfolio API proxy via Vercel Serverless Function
 * Import this component wherever you need to display Devfolio hackathon data
 * 
 * Usage:
 * import { DevfolioStats } from './components/DevfolioStats';
 * 
 * <DevfolioStats />
 */

import { useDevfolioData } from '../hooks/useDevfolioData';
import { Card } from './ui/card';

export function DevfolioStats() {
  const { data, loading, error, refetch } = useDevfolioData();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        <span className="ml-3 text-white">Loading hackathon data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-400 mb-4">Error: {error}</div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-400">
        No hackathon data available
      </div>
    );
  }

  return (
    <Card className="p-6 bg-black/50 border-yellow-400/30">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">{data.name}</h2>
      
      {data.tagline && (
        <p className="text-white/80 mb-4">{data.tagline}</p>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4">
        {data.starts_at && (
          <div>
            <p className="text-gray-400 text-sm">Starts</p>
            <p className="text-white font-semibold">
              {new Date(data.starts_at).toLocaleDateString()}
            </p>
          </div>
        )}

        {data.ends_at && (
          <div>
            <p className="text-gray-400 text-sm">Ends</p>
            <p className="text-white font-semibold">
              {new Date(data.ends_at).toLocaleDateString()}
            </p>
          </div>
        )}

        {data.min_team_size && data.max_team_size && (
          <div>
            <p className="text-gray-400 text-sm">Team Size</p>
            <p className="text-white font-semibold">
              {data.min_team_size} - {data.max_team_size}
            </p>
          </div>
        )}

        {data.registration_ends_at && (
          <div>
            <p className="text-gray-400 text-sm">Registration Ends</p>
            <p className="text-white font-semibold">
              {new Date(data.registration_ends_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {data.themes && data.themes.length > 0 && (
        <div className="mt-4">
          <p className="text-gray-400 text-sm mb-2">Themes</p>
          <div className="flex flex-wrap gap-2">
            {data.themes.map((theme: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

/**
 * Alternative: Fetch data directly without a hook
 * 
 * Example usage in any component:
 */

export async function fetchDevfolioData() {
  try {
    const response = await fetch('/api/devfolio');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Devfolio data:', error);
    throw error;
  }
}

/**
 * Example usage in a component with direct fetch:
 * 
 * const [hackathonData, setHackathonData] = useState(null);
 * 
 * useEffect(() => {
 *   fetchDevfolioData()
 *     .then(data => setHackathonData(data))
 *     .catch(error => console.error(error));
 * }, []);
 */
