import type { Request,Response ,NextFunction} from "express";
import { AppError, hashCode } from "../helper.js";
import { receiveInfo, waitForAnswer } from "../services/receive.services.js";

export const rsi= async(req:Request,res:Response,next:NextFunction)=>{
    try{

        const code=req.query.code as string;

        if (!code) {
            throw new AppError("Missing required fields", 400);
        }

        const key=hashCode(code);

        const data = await receiveInfo(key);

        return res.status(200).json({
            sdp:data.sdp,
            ice:data.ice
        })

   }catch(error){
       next(error);
   }

}


export const rsa= async(req:Request,res:Response,next:NextFunction)=>{
    try{
    const code=req.query.code as string;

    if (!code) {
            throw new AppError("Missing required fields", 400);
        }


    const key=hashCode(code);


    const data = await waitForAnswer(key);

    return res.status(200).json({
        ansSdp:data.answerSDP,
        ansIce:data.answerIceCandidates
    })

    }catch(error){
        next(error);
    }

}
