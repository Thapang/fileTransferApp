import redisClient from "../db.js";
import { AppError } from "../helper.js";


export const generateKey = async (code: string) => {
  try {
    await redisClient.hSet(`user:${code}`, {
      status: "0"
    });

    return true;
  } catch (error) {
    throw new AppError("Cannot create key", 500);
  }
};