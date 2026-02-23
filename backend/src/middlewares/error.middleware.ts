import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

// Standard Error Interface
export interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[${req.method}] ${req.originalUrl} >> StatusCode:: ${statusCode}, Message:: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err: CustomError = new Error(`Route not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};
