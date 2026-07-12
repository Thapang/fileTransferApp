import redisClient, { subscriberClient } from "../db.js";
import { AppError } from "../helper.js";


export const receiveInfo = async (code: string) => {
  try {
    const key = `user:${code}`;

    const exists = await redisClient.exists(key);

    if (!exists) {
      throw new AppError("Code not found", 404);
    }

    const data = await redisClient.hGetAll(key);

    return {
      sdp: data.senderSDP,
      ice: data.senderIceCandidates,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Cannot get the data", 500);
  }
};




export const waitForAnswer = async (
  code: string
): Promise<{
  answerSDP: unknown;
  answerIceCandidates: unknown;
}> => {
  return new Promise((resolve, reject) => {
    subscriberClient
      .subscribe(`ch:${code}`, async (message) => {
        try {
          const data = JSON.parse(message);

          await subscriberClient.unsubscribe(`ch:${code}`);

          resolve({
            answerSDP: data.answerSDP,
            answerIceCandidates: data.answerIceCandidates,
          });
        } catch (error) {
          reject(new AppError("Invalid message received", 500));
        }
      })
      .catch(() => {
        reject(new AppError("Failed to subscribe", 500));
      });
  });
};