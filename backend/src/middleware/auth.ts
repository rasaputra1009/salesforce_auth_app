import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from '../config/logger'; 

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    logger.warn('Authentication failed: No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      logger.warn('Authentication failed: Invalid or expired token');
      return res.status(403).json({ message: 'Invalid token' });
    }

    logger.info('Authentication successful', {
      user: (user as JwtPayload)?.email || 'Unknown user',
    });

    req.user = user;
    next();
  });
};

export default authenticateToken;
