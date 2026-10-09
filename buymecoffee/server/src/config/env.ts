import dotenv from "dotenv"
dotenv.config()

function requireValue(name:string):string {
    if(!process.env[name]) {
       throw new Error(` ${name} secrets is required `)
    }

    return process.env[name]
}


const nodeEnv = requireValue("NODE_ENV");
const port = Number(process.env.PORT ?? "3000");
const corsOrigins = (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid TCP port");
}
if (nodeEnv === "production" && corsOrigins.length === 0) {
    throw new Error("CORS_ORIGINS must be configured in production");
}

export const configEnv = {
    MONGO_URI:requireValue("MONGO_URI"),
    ACCESS_TOKEN_SECRET:requireValue("ACCESS_TOKEN_SECRET"),
    REFRESH_TOKEN_SECRET:requireValue("REFRESH_TOKEN_SECRET"),
    NODE_ENV: nodeEnv,
    PORT: port,
    CORS_ORIGINS: corsOrigins,
RAZORPAY_KEY_ID: requireValue("RAZORPAY_KEY_ID"),
RAZORPAY_KEY_SECRET: requireValue("RAZORPAY_KEY_SECRET"),
RAZORPAY_WEBHOOK_SECRET: requireValue("RAZORPAY_WEBHOOK_SECRET"),

}

