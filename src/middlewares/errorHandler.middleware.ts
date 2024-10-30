import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = (err as any).statusCode || 500;

  const message = err.message || "Internal server error";

  res.status(statusCode).json({ message });
};
