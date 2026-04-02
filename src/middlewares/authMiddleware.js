const jwt = require('jsonwebtoken');

// Bouncer 1: Are you logged in?
const authenticateUser = (req, res, next) => {
  // 1. Look for the 'Authorization' header in the incoming request
  const authHeader = req.headers.authorization;

  // 2. Check if it exists 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  // 3. Extract just the token string
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify the token using our secret key
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the user's data (id, role) to the request object so our controllers can use it
    req.user = decodedPayload;
    
    // 6. Let the request pass through to the next function
    next();
  } catch (error) {
    // If the token is fake, altered, or expired, block the request
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// Bouncer 2: Do you have the right job title?
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    // We assume authenticateUser has already run and attached req.user
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    // If they have the right role, let them pass
    next();
  };
};

module.exports = { authenticateUser, authorizeRole };