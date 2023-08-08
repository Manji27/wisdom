const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    console.log('No token provided');  // Log when no token is provided
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    console.log('User:', req.user);  // Log the decoded user
    next();
  } catch (ex) {
    console.log('Invalid token:', token);  // Log when an invalid token is provided
    res.status(400).json({ message: 'Invalid token.' });
  }
}

module.exports = auth;
