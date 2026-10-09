import dotenv from "dotenv";
dotenv.config();
function requireValue(name) {
    if (!process.env[name]) {
        throw new Error(` ${name} secrets is required `);
    }
    return process.env[name];
}
export const configEnv = {
    MONGO_URI: requireValue("MONGO_URI"),
    ACCESS_TOKEN_SECRET: requireValue("ACCESS_TOKEN_SECRET"),
    REFRESH_TOKEN_SECRET: requireValue("REFRESH_TOKEN_SECRET"),
    NODE_ENV: requireValue("NODE_ENV"),
    RAZORPAY_KEY_ID: requireValue("RAZORPAY_KEY_ID"),
    RAZORPAY_KEY_SECRET: requireValue("RAZORPAY_KEY_SECRET"),
    RAZORPAY_WEBHOOK_SECRET: requireValue("RAZORPAY_WEBHOOK_SECRET"),
};
//# sourceMappingURL=env.js.map