const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.error("Unauthorized: No token provided");
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(403).json({ error: 'Forbidden: Token is invalid or expired' });
    }

    console.log("Token decoded successfully, userId:", decoded.userId);
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
