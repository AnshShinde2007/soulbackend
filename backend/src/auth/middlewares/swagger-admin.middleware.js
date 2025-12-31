import jwt from 'jsonwebtoken';

export function swaggerAdminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}