import type { Request,Response,NextFunction } from "express";

import {generateSixDigitCode, hashCode} from "../helper.js";


import { generateKey, senderAnswers, senderInfo } from "../services/send.service.js";


export const generate = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const code = generateSixDigitCode();
    const userCode = hashCode(code);

    await generateKey(userCode);

    return res.status(201).json({
      message: "Code created successfully",  
      code,
    });

  } catch (error) {
    next(error);
  }
};


export const sendInfo = async (req:Request,res:Response,next:NextFunction)=>{
    
    try{

        const code:string=req.body.code
        const sdp:any=req.body.sdp
        const iceCandidates:any=req.body.iceCandidates

        const encryptCode=hashCode(code);

        await senderInfo(encryptCode,sdp,iceCandidates);

        return res.status(201).json({
            success:true,
            message: "sender's info created succesfully", 
        });

    } catch (error){
        next(error);
    };

};


export const sendAnswers= async (req:Request,res:Response,next:NextFunction)=>{
    try{

        const code:string=req.body.code
        const sdp:any=req.body.sdp
        const iceCandidates:any=req.body.iceCandidates

        const encryptCode=hashCode(code);

        await senderAnswers(encryptCode,sdp,iceCandidates);

        return res.status(201).json({
            success:true,
            message: "Answers info created succesfully", 
        });

    } catch (error){
        next(error);
    };
};