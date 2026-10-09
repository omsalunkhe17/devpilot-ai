import "dotenv/config";
import { createClient } from "redis";

const redisClient = createClient({
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        tls: process.env.REDIS_TLS === "true"
    }
});

redisClient.on("error", (error) => {
    console.error("Redis Client Error:", error.message);
});

export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log("Redis connected successfully");
        }
    } catch (error) {
        console.error("Redis connection failed:", error.message);
    }
};

export default redisClient;
