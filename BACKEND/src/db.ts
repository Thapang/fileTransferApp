import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL!,
});

const subscriberClient = redisClient.duplicate();

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

subscriberClient.on("error", (err) => {
  console.error("Redis Subscriber Error", err);
});

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  if (!subscriberClient.isOpen) {
    await subscriberClient.connect();
  }
}

export { subscriberClient };

export default redisClient;