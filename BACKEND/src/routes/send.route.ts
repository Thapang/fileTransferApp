import {Router} from "express";

import {deleted, generate, sendAnswers, sendInfo} from "../controller/send.controller.js"

const sendRouter=Router();

sendRouter.get("/generate",generate)

sendRouter.post("/senderInfo",sendInfo)

sendRouter.post("/answers",sendAnswers)

sendRouter.delete("/deleteCode/:code",deleted)



export default sendRouter;

