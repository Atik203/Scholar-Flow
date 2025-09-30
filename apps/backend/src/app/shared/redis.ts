import { createClient, RedisClientOptions } from "redis";
import config from "../config";

export type RedisInstance = ReturnType<typeof createClient> | null;

let client: RedisInstance = null;
let connectingPromise: Promise<RedisInstance> | null = null;
let connectionFailed = false;

const buildRedisOptions = (): RedisClientOptions | null => {
  const { host, port, password, db, tls } = config.redis;

  if (!host || !port) {
    return null;
  }

  const baseOptions: RedisClientOptions = {
    socket: {
      host,
      port,
    },
    password: password || undefined,
    database: typeof db === "number" ? db : 0,
  };

  // Add TLS if enabled
  if (tls && baseOptions.socket) {
    (baseOptions.socket as any).tls = {};
  }

  return baseOptions;
};

export const getRedisClient = async (): Promise<RedisInstance> => {
  if (client) {
    return client;
  }

  if (connectionFailed) {
    return null;
  }

  const options = buildRedisOptions();
  if (!options) {
    return null;
  }

  if (!connectingPromise) {
    const redisClient = createClient(options);

    redisClient.on("error", (error) => {
      if (process.env.NODE_ENV !== "test") {
        console.error("[Redis] Connection error:", error.message);
      }
    });

    connectingPromise = redisClient
      .connect()
      .then(() => {
        if (process.env.NODE_ENV !== "test") {
          const socket = options.socket as { host?: string; port?: number };
          console.log(
            `✅ Connected to Redis at ${socket?.host}:${socket?.port} (db ${options.database ?? 0})`
          );
        }
        client = redisClient;
        return client;
      })
      .catch((error) => {
        connectionFailed = true;
        if (process.env.NODE_ENV !== "test") {
          console.warn(
            "⚠️  Redis connection failed. Continuing without cache:",
            error.message
          );
        }
        return null;
      })
      .finally(() => {
        connectingPromise = null;
      });
  }

  return connectingPromise;
};

export const disconnectRedis = async () => {
  if (client) {
    await client.quit();
    client = null;
  }
};

export const isRedisConfigured = () => {
  const options = buildRedisOptions();
  return Boolean(options);
};
