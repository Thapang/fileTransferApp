import {Router} from "express";

import {generate, sendAnswers, sendInfo} from "../controller/send.controller.js"

const sendRouter=Router();

sendRouter.get("/generate",generate)

sendRouter.post("/senderInfo",sendInfo)

sendRouter.post("/answers",sendAnswers)



export default sendRouter;

