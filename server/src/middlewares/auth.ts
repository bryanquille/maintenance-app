import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JWTPayload } from '../types/index.js';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'No se proporcionó token de autenticación' });
      return;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, secret) as JWTPayload;

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Token inválido o expirado' });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.rol !== 'admin') {
    res.status(403).json({ success: false, error: 'Acceso denegado. Se requiere rol de administrador' });
    return;
  }
  next();
};

export const tecnicoMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.rol !== 'admin' && req.user?.rol !== 'tecnico') {
    res.status(403).json({ success: false, error: 'Acceso denegado. Se requiere rol de técnico' });
    return;
  }
  next();
};

export const empresaMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const empresaId = req.params.empresaId || req.body.empresaId;
  
  if (req.user?.rol === 'admin') {
    next();
    return;
  }

  if (empresaId && req.user?.empresaId !== empresaId) {
    res.status(403).json({ success: false, error: 'No tienes acceso a esta empresa' });
    return;
  }

  next();
};