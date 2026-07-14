import {redisClient, subscriberClient} from "../db.js";
import { AppError, hashCode } from "../helper.js";


export const generateKey = async (code:string) => {
  try {
    const key=`user:${code}`;

    console.log("key:",key);

    await redisClient.hSet(key, {
      status: "0"
    });

    console.log(`user:${code}`)

    return true;
  } catch (error) {
    console.error(error); // add this
    throw new AppError("Cannot create key", 500);
  }
}

export const senderInfo = async (code: string,senderSDP: unknown,senderIceCandidates: unknown) => {
    try {
   
    const key = `user:${code}`;  
    const exists = await redisClient.exists(key);

    if (!exists) {
      throw new AppError("Code not found", 404);
    }

        await redisClient.hSet(`user:${code}`, {
            senderSDP: JSON.stringify(senderSDP),
            senderIceCandidates: JSON.stringify(senderIceCandidates),
            status:"waiting"
        });

    } catch (error) {
      if (error instanceof AppError) {
        throw error;
    }


        throw new AppError("Cannot store sender info", 500);
    }
}


export const senderAnswers = async (code: string,answerSDP: unknown,answerIceCandidates: unknown)=>{
    try {
      
      const key = `user:${code}`;
      const exists = await redisClient.exists(key);

      if (!exists) {
        throw new AppError("Code not found", 404);
    }

        await redisClient.hSet(`user:${code}`, {
            answerSDP: JSON.stringify(answerSDP),
            answerIceCandidates: JSON.stringify(answerIceCandidates),
            status:"completed"
        });

        console.log("published channel:", `ch:${code}`);

         await subscriberClient.publish(
            `ch:${code}`,
            JSON.stringify({
            answerSDP,
            answerIceCandidates,
      })
    );

    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

        throw new AppError("Cannot store answer info", 500);
    }
}



export const remove=async(code:string)=>{
  try{

    const key = `user:${code}`;
    const exists = await redisClient.exists(key);

      if (!exists) {
        throw new AppError("Code not found", 404);
    }

    await redisClient.del(key);


  }catch(error){

  if (error instanceof AppError) {
        throw error;
      }

        throw new AppError("Cannot store answer info", 500);
    }
}



