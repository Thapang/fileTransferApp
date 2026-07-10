import type { Request, Response, NextFunction } from "express";
import { AppError } from "../helper.js";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    });
  }

  return res.status(500).json({
    success: false,
    status: "error",
    message: "Internal server error"
  });
};