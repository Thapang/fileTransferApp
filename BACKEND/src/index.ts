import "dotenv/config";
import express from "express";
import cors from "cors";

import type { Request, Response } from "express";

import { errorMiddleware } from "./middleware/error.middleware.js";
import sendRouter from "./routes/send.route.js";
import receiveRouter from "./routes/receive.route.js";
import { connectRedis } from "./db.js";

const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

app.use(cors());

app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

app.get("/api/v1/hello", (req: Request, res: Response) => {
  res.send("hello");
});

app.use("/api/v1/send", sendRouter);
app.use("/api/v1/receive", receiveRouter);

app.use(errorMiddleware);

await connectRedis();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});