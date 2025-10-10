// backend/EventsModule/Middleware/authMiddleware.js
const verifyApiKey = (req, res, next) => {
  // IMPORTANT: For preflight OPTIONS requests, just pass them through.
  // The actual request (GET, POST, etc.) will be checked for the API key.
  if (req.method === 'OPTIONS') {
    console.log('CORS preflight (OPTIONS) request detected. Bypassing API Key check.');
    return next();
  }

  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    console.warn('API Key missing in request headers.');
    return res.status(401).json({ success: false, message: 'No API Key provided. Access Denied.' });
  }

  if (apiKey !== process.env.API_KEY) {
    console.warn('Invalid API Key provided.');
    return res.status(403).json({ success: false, message: 'Invalid API Key. Access Denied.' });
  }

  next(); // API Key is valid, proceed
};

export { verifyApiKey };