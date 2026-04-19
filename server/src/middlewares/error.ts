import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
}

export const errorMiddleware = (err: AppError, req: Request, res: Response, _next: NextFunction): void => {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (isDevelopment) {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
  }

  const statusCode = err.statusCode || 500;

  if (statusCode === 500) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
    });
  } else {
    res.status(statusCode).json({
      success: false,
      error: err.message,
    });
  }
};

export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Ruta ${req.originalUrl} no encontrada`,
  });
};

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};