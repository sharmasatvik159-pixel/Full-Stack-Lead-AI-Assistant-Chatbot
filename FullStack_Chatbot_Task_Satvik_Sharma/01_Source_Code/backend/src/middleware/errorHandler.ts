import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log server-side only for internal debugging
  console.error('[Error Handler]', err.message || err);

  const statusCode = err.statusCode && typeof err.statusCode === 'number' ? err.statusCode : 500;
  
  // Safe user-facing message - sensitive details are NEVER exposed to clients
  const clientMessage = statusCode === 500 
    ? 'An unexpected error occurred while processing your request. Please try again later.'
    : (err.message || 'Request processing failed.');

  res.status(statusCode).json({
    success: false,
    message: clientMessage
  });
}
