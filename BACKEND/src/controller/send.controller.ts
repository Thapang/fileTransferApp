import type { Request,Response,NextFunction } from "express";

import {AppError, generateSixDigitCode, hashCode} from "../helper.js";


import { generateKey, remove, senderAnswers, senderInfo } from "../services/send.service.js";


export const generate = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const code = generateSixDigitCode();
    const userCode = hashCode(code);
    
    console.log(code)
    console.log(userCode)

    await generateKey(userCode);

    return res.status(201).json({
      message: "Code created successfully",  
      code,
      userCode,
    });

  } catch (error) {
    next(error);
  }
}


export const sendInfo = async (req:Request,res:Response,next:NextFunction)=>{
    
    try{

        const code:string=req.body.code
        const sdp:unknown=req.body.sdp
        const iceCandidates:unknown=req.body.iceCandidates

        if (!code || !sdp || !iceCandidates) {
            throw new AppError("Missing required fields", 400);
        }


        const encryptCode=hashCode(code);

        await senderInfo(encryptCode,sdp,iceCandidates);

        return res.status(201).json({
            success:true,
            message: "sender's info created succesfully", 
        });

    } catch (error){
        next(error);
    };

}


export const sendAnswers= async (req:Request,res:Response,next:NextFunction)=>{
    try{

        const code:string=req.body.code
        const sdp:unknown=req.body.sdp
        const iceCandidates:unknown=req.body.iceCandidates

        if (!code || !sdp || !iceCandidates) {
            throw new AppError("Missing required fields", 400);
        }

        const encryptCode=hashCode(code);

        await senderAnswers(encryptCode,sdp,iceCandidates);

        return res.status(201).json({
            success:true,
            message: "Answers info created succesfully", 
        });

    } catch (error){
        next(error);
    };
}


export const deleted = async(req:Request<{code:string}>,res:Response,next:NextFunction)=>{
    try{
    const code:string = req.params.code!;

    if (!code) {
            throw new AppError("Missing required fields", 400);
        }
    
    const key=hashCode(code);

    await remove(key);

    }catch(error){
        next(error);
    }
}