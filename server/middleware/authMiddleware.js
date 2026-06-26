import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Token comes as: "Bearer eyJhbGci..."
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;  // attach userId to request for use in route handlers
    next();                   // move to the actual route
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;