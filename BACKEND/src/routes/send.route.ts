import {Router} from "express";

import {generate} from "../controller/send.controller.js"

const sendRouter=Router();

sendRouter.get("/generate",generate)

export default sendRouter;

