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

export const senderInfo = async (code: string,senderSDP: unknown,senderIceCandidates: unknown) => {
    try {

        await redisClient.hSet(`user:${code}`, {
            senderSDP: JSON.stringify(senderSDP),
            senderIceCandidates: JSON.stringify(senderIceCandidates),
            status:"waiting"
        });

    } catch (error) {
        throw new AppError("Cannot store sender info", 500);
    }
};


export const senderAnswers = async (code: string,answerSDP: unknown,answerIceCandidates: unknown)=>{
    try {

        await redisClient.hSet(`user:${code}`, {
            answerSDP: JSON.stringify(answerSDP),
            answerIceCandidates: JSON.stringify(answerIceCandidates),
            status:"completed"
        });


         await redisClient.publish(
            `ch:${code}`,
            JSON.stringify({
            answerSDP,
            answerIceCandidates,
      })
    );

    } catch (error) {
        throw new AppError("Cannot store answer info", 500);
    }
};
