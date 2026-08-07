import { useState } from 'react';
import { useDevfolioData } from '../hooks/useDevfolioData';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

/**
 * DevfolioTest Component
 * 
 * Test page to verify the Devfolio API proxy is working correctly.
 * Add this to your routes to test the integration.
 * 
 * Usage:
 * import { DevfolioTest } from './pages/DevfolioTest';
 * <Route path="/test-devfolio" element={<DevfolioTest />} />
 */

export function DevfolioTest() {
  const { data, loading, error, refetch } = useDevfolioData();
  const [rawResponse, setRawResponse] = useState<string>('');
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Manual fetch test
  const testDirectFetch = async () => {
    setFetchStatus('loading');
    setRawResponse('Loading...');
    
    try {
      const response = await fetch('/api/devfolio');
      const json = await response.json();
      
      setRawResponse(JSON.stringify(json, null, 2));
      setFetchStatus(response.ok ? 'success' : 'error');
    } catch (err) {
      setRawResponse(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setFetchStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-8">
          Devfolio API Test Page
        </h1>

        {/* Test Status Banner */}
        <Card className="p-6 mb-8 bg-black/50 border-yellow-400/30">
          <h2 className="text-2xl font-bold text-white mb-4">Connection Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">API Endpoint:</p>
              <code className="text-green-400">/api/devfolio</code>
            </div>
            <div>
              <p className="text-gray-400">Status:</p>
              <span className={`font-bold ${
                loading ? 'text-yellow-400' :
                error ? 'text-red-400' :
                data ? 'text-green-400' : 'text-gray-400'
              }`}>
                {loading ? '⏳ Loading...' :
                 error ? '❌ Error' :
                 data ? '✅ Connected' : '⚪ Idle'}
              </span>
            </div>
          </div>
        </Card>

        {/* Test with Hook */}
        <Card className="p-6 mb-8 bg-black/50 border-yellow-400/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Test with useDevfolioData Hook</h2>
            <Button onClick={refetch} className="bg-yellow-400 text-black hover:bg-yellow-500">
              Refresh
            </Button>
          </div>

          {loading && (
            <div className="flex items-center gap-3 text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              <span>Loading data from proxy...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded p-4 text-red-300">
              <strong>Error:</strong> {error}
              <details className="mt-2">
                <summary className="cursor-pointer">Troubleshooting</summary>
                <ul className="mt-2 ml-4 list-disc text-sm">
                  <li>Ensure you've deployed to Vercel</li>
                  <li>Check that api/devfolio.js exists</li>
                  <li>Verify vercel.json is configured correctly</li>
                  <li>Check browser console for detailed errors</li>
                </ul>
              </details>
            </div>
          )}

          {data && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded">
                  <p className="text-gray-400 text-sm">Hackathon Name</p>
                  <p className="text-white font-bold text-lg">{data.name}</p>
                </div>
                
                <div className="bg-white/5 p-4 rounded">
                  <p className="text-gray-400 text-sm">Slug</p>
                  <p className="text-white font-bold text-lg">{data.slug}</p>
                </div>

                <div className="bg-white/5 p-4 rounded">
                  <p className="text-gray-400 text-sm">Team Size</p>
                  <p className="text-white font-bold text-lg">
                    {data.min_team_size} - {data.max_team_size}
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded">
                  <p className="text-gray-400 text-sm">Registrations</p>
                  <p className="text-white font-bold text-lg">
                    {data.registrations_count || 0}
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded">
                  <p className="text-gray-400 text-sm">Teams</p>
                  <p className="text-white font-bold text-lg">
                    {data.teams_count || 0}
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded">
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-green-400 font-bold text-lg">
                    {new Date(data.registration_ends_at) > new Date() ? 'Open' : 'Closed'}
                  </p>
                </div>
              </div>

              {data.tagline && (
                <div className="bg-white/5 p-4 rounded">
                  <p className="text-gray-400 text-sm mb-2">Tagline</p>
                  <p className="text-white">{data.tagline}</p>
                </div>
              )}

              {data.themes && data.themes.length > 0 && (
                <div className="bg-white/5 p-4 rounded">
                  <p className="text-gray-400 text-sm mb-2">Themes</p>
                  <div className="flex flex-wrap gap-2">
                    {data.themes.map((theme: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Test with Direct Fetch */}
        <Card className="p-6 bg-black/50 border-yellow-400/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Test with Direct Fetch</h2>
            <Button 
              onClick={testDirectFetch} 
              className="bg-blue-500 text-white hover:bg-blue-600"
              disabled={fetchStatus === 'loading'}
            >
              {fetchStatus === 'loading' ? 'Fetching...' : 'Test Direct Fetch'}
            </Button>
          </div>

          {rawResponse && (
            <div className="bg-gray-900 rounded p-4 overflow-auto max-h-96">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                {rawResponse}
              </pre>
            </div>
          )}

          {fetchStatus === 'success' && (
            <p className="text-green-400 mt-2">✅ Direct fetch successful!</p>
          )}

          {fetchStatus === 'error' && (
            <p className="text-red-400 mt-2">❌ Direct fetch failed. Check console.</p>
          )}
        </Card>

        {/* Instructions */}
        <Card className="p-6 mt-8 bg-black/50 border-yellow-400/30">
          <h2 className="text-2xl font-bold text-white mb-4">Integration Instructions</h2>
          <div className="space-y-3 text-gray-300">
            <p>✅ If you see data above, the API proxy is working correctly!</p>
            <p>Now you can use it in your components:</p>
            
            <div className="bg-gray-900 rounded p-4 mt-4">
              <code className="text-sm text-green-400">
                {`import { useDevfolioData } from './hooks/useDevfolioData';

function MyComponent() {
  const { data, loading, error } = useDevfolioData();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{data?.name}</div>;
}`}
              </code>
            </div>
          </div>
        </Card>

        {/* Browser Console Tests */}
        <Card className="p-6 mt-8 bg-black/50 border-yellow-400/30">
          <h2 className="text-2xl font-bold text-white mb-4">Browser Console Tests</h2>
          <p className="text-gray-300 mb-4">
            Open your browser console (F12) and run these commands:
          </p>
          
          <div className="space-y-3">
            <div className="bg-gray-900 rounded p-3">
              <p className="text-gray-400 text-sm mb-1">Test 1: Basic fetch</p>
              <code className="text-yellow-400 text-sm">
                fetch('/api/devfolio').then(r =&gt; r.json()).then(console.log)
              </code>
            </div>

            <div className="bg-gray-900 rounded p-3">
              <p className="text-gray-400 text-sm mb-1">Test 2: Check status</p>
              <code className="text-yellow-400 text-sm">
                fetch('/api/devfolio').then(r =&gt; console.log(r.status, r.statusText))
              </code>
            </div>

            <div className="bg-gray-900 rounded p-3">
              <p className="text-gray-400 text-sm mb-1">Test 3: Get specific data</p>
              <code className="text-yellow-400 text-sm">
                fetch('/api/devfolio').then(r =&gt; r.json()).then(d =&gt; console.log(d.name, d.registrations_count))
              </code>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DevfolioTest;
