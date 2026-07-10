import type { Request,Response,NextFunction } from "express";

import {generateSixDigitCode, hashCode} from "../helper.js";


import { generateKey } from "../services/send.service.js";


export const generate = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const code = generateSixDigitCode();
    const userCode = hashCode(code);

    await generateKey(userCode);

    return res.status(201).json({
      code,
    });

  } catch (error) {
    next(error);
  }
};