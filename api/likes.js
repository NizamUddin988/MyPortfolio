// api/likes.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // These come from your environment variables (without VITE_)
  const REDIS_URL = process.env.REDIS_REST_URL;
  const REDIS_TOKEN = process.env.REDIS_REST_TOKEN;
  
  if (!REDIS_URL || !REDIS_TOKEN) {
    console.error('Missing Redis credentials');
    return res.status(500).json({ error: 'Redis not configured' });
  }
  
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${REDIS_URL}/get/portfolio_likes`, {
        headers: {
          'Authorization': `Bearer ${REDIS_TOKEN}`
        }
      });
      const data = await response.json();
      return res.status(200).json({ count: data.result || 0 });
    } catch (error) {
      console.error('GET error:', error);
      return res.status(500).json({ error: 'Failed to fetch likes' });
    }
  }
  
  if (req.method === 'POST') {
    try {
      const response = await fetch(`${REDIS_URL}/incr/portfolio_likes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${REDIS_TOKEN}`
        }
      });
      const data = await response.json();
      return res.status(200).json({ count: data.result });
    } catch (error) {
      console.error('POST error:', error);
      return res.status(500).json({ error: 'Failed to update likes' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}