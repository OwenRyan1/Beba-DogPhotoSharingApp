const jwt = require('jsonwebtoken');
const User = require('../models/user'); 

/**
 * @description Middleware that verifies JWT token from Authorization header.
 * Checks if the token is valid and fetches the associated user from the database.
 * Attaches the user object to req.user for downstream use.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Object} 401 - If token is missing or user is not found
 * @returns {Object} 400 - If token is invalid
 */
const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); //auth header
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId); // returns the entire user after authenticated 
    
    if (!user) {
        return res.status(401).json({ message: 'Invalid token, user not found' });
    }
    req.user = user; // Attach user object to request
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;
