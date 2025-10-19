import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

export const ensureSameuser = (req, res, next) => {
  const targetID = req.params.id || req.body.id;
  if (!targetID) return res.status(400).json({ message: 'Target user ID is missing' });

  if (String(req.user.id) !== String(targetID) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: cannot modify other user' });
  } 
  next();
}
