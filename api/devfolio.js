/**
 * Vercel Serverless Function - Devfolio API Proxy
 * Endpoint: /api/devfolio
 * Purpose: Bypass CORS by proxying requests to Devfolio API
 */

export default async function handler(req, res) {
  // Set CORS headers to allow requests from your domain
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // In production, use 'https://innofusion.tech'
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Accept, Origin'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only GET requests are supported'
    });
  }

  try {
    // Fetch data from Devfolio API
    const devfolioUrl = 'https://api.devfolio.co/api/hackathons/innofusion-3';
    
    const response = await fetch(devfolioUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Innofusion-Website/1.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // Handle non-200 responses from Devfolio
    if (!response.ok) {
      console.error(`Devfolio API error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({
        error: 'Devfolio API error',
        status: response.status,
        message: response.statusText
      });
    }

    // Parse JSON response
    const data = await response.json();

    // Return successful response with caching headers
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching from Devfolio API:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch data from Devfolio API',
      details: error.message
    });
  }
}
