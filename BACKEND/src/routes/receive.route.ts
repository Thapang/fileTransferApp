import {Router} from "express";
import { rsa, rsi } from "../controller/receive.controller.js";

const receiveRouter=Router();

receiveRouter.get("/receiveSenderInfo",rsi);

receiveRouter.get("/receiveAnswers/:code",rsa);

export default receiveRouter;