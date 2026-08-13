/**
 * Quick Integration Guide
 * 
 * This file shows you exactly how to replace old Devfolio API calls with the new proxy.
 */

import { useState, useEffect } from 'react';
import { useDevfolioData } from './src/hooks/useDevfolioData';

// ========================================
// BEFORE (❌ CORS Error)
// ========================================

// Old way - This causes CORS errors:
const oldFetch = async () => {
  const response = await fetch('https://api.devfolio.co/api/hackathons/innofusion-3');
  const data = await response.json();
  return data;
};

// ========================================
// AFTER (✅ Works!)
// ========================================

// New way - Using the proxy:
const newFetch = async () => {
  const response = await fetch('/api/devfolio');
  const data = await response.json();
  return data;
};

// ========================================
// INTEGRATION EXAMPLES
// ========================================

// Example 1: Simple fetch in a component
export function Example1() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/devfolio')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return <div>{data?.name}</div>;
}

// Example 2: Using the custom hook (Recommended)
export function Example2() {
  const { data, loading, error } = useDevfolioData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>{data?.name}</h1>
      <p>{data?.tagline}</p>
      <p>Team size: {data?.min_team_size} - {data?.max_team_size}</p>
    </div>
  );
}

// Example 3: Fetch on button click
export function Example3() {
  const [data, setData] = useState<any>(null);

  const handleFetch = async () => {
    try {
      const response = await fetch('/api/devfolio');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  return (
    <div>
      <button onClick={handleFetch}>Load Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

// Example 4: Get participant count
export function Example4() {
  const { data } = useDevfolioData();

  // Access any field from the Devfolio response
  return (
    <div>
      <h3>Hackathon Stats</h3>
      <p>Registrations: {data?.registrations_count || 0}</p>
      <p>Teams: {data?.teams_count || 0}</p>
      <p>Max Team Size: {data?.max_team_size}</p>
    </div>
  );
}

// Example 5: Display themes/tracks
export function Example5() {
  const { data } = useDevfolioData();

  return (
    <div>
      <h3>Themes</h3>
      {data?.themes?.map((theme: string) => (
        <span key={theme} className="badge">{theme}</span>
      ))}
    </div>
  );
}

// Example 6: Async/await with error handling
export function Example6() {
  const [info, setInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/devfolio');
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const json = await res.json();
        setInfo(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    loadData();
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!info) return <div>Loading...</div>;

  return <div>{info.name}</div>;
}

// ========================================
// COMMON USE CASES
// ========================================

// Get registration deadline
export const getRegistrationDeadline = async () => {
  const response = await fetch('/api/devfolio');
  const data = await response.json();
  return new Date(data.registration_ends_at);
};

// Check if registration is open
export const isRegistrationOpen = async () => {
  const response = await fetch('/api/devfolio');
  const data = await response.json();
  const deadline = new Date(data.registration_ends_at);
  return deadline > new Date();
};

// Get prize pool
export const getPrizes = async () => {
  const response = await fetch('/api/devfolio');
  const data = await response.json();
  return data.prizes || [];
};

// Get organizers
export const getOrganizers = async () => {
  const response = await fetch('/api/devfolio');
  const data = await response.json();
  return data.organisers || [];
};

// ========================================
// TESTING IN BROWSER CONSOLE
// ========================================

// Open your deployed site (innofusion.tech) and run:
/*

// Test 1: Simple fetch
fetch('/api/devfolio').then(r => r.json()).then(console.log)

// Test 2: Check response status
fetch('/api/devfolio').then(r => console.log(r.status, r.statusText))

// Test 3: Get specific data
fetch('/api/devfolio')
  .then(r => r.json())
  .then(data => console.log('Hackathon:', data.name, 'Teams:', data.max_team_size))

*/

export default {
  oldFetch,
  newFetch,
  getRegistrationDeadline,
  isRegistrationOpen,
  getPrizes,
  getOrganizers,
};
