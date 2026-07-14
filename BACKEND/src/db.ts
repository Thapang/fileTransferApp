import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined");
}

export const redisClient = createClient({
  url: redisUrl,
});

export const subscriberClient = redisClient.duplicate();

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

subscriberClient.on("error", (err) => {
  console.error("Redis Subscriber Error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

subscriberClient.on("connect", () => {
  console.log("Redis subscriber connected");
});

export async function connectRedis() {
  await Promise.all([
    !redisClient.isOpen && redisClient.connect(),
    !subscriberClient.isOpen && subscriberClient.connect(),
  ]);
}