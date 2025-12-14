import pino from "pino";

const level = process.env.NODE_ENV === "production" ? "info" : "debug";

export const logger = pino({
  level,
  transport: process.env.NODE_ENV === "production" ? undefined : {
    target: "pino-pretty",
    options: { 
      colorize: true,
      translateTime: "yyyy-mm-dd HH:MM:ss",
      ignore: "pid,hostname",
      hideObject: false,
    },
  },
});