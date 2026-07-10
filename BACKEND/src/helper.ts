// hash.ts
import crypto from "node:crypto";
import redisClient from "./db.js";

export function hashCode(code: string): string {
  return crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");
}

export async function codeExists(code: string): Promise<boolean> {
  const hash = hashCode(code);

  return (await redisClient.exists(`user:${hash}`)) === 1;
}

export function generateSixDigitCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}



export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4")
      ? "fail"
      : "error";

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}