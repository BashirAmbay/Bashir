const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'binuthman_jwt_secret_token_key_2026_water_app';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }

    next();
  };
}

const isAdmin = requireRole(['admin']);
const isCustomer = requireRole(['customer']);

module.exports = {
  authenticateToken,
  requireRole,
  isAdmin,
  isCustomer
};
