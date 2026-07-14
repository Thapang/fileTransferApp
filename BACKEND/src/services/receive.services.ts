import {redisClient,  subscriberClient } from "../db.js";
import { AppError } from "../helper.js";


export const receiveInfo = async (code: string) => {
    try {

        const key = `user:${code}`;

        const exists = await redisClient.exists(key);

        if (!exists) {
            throw new AppError("Code not found", 404);
        }

        const data = await redisClient.hGetAll(key);

        console.log("Redis Data:", data);

        if (!data.senderSDP || !data.senderIceCandidates) {
            throw new AppError("Sender info not ready", 404);
        }

        return {
            sdp: JSON.parse(data.senderSDP),
            ice: JSON.parse(data.senderIceCandidates),
        };

    } catch (error) {

        if (error instanceof AppError) {
            throw error;
        }

        console.error(error);

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

          console.log("sub data",data);

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