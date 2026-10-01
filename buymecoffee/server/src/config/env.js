import dotenv from "dotenv";
dotenv.config();
function requireValue(name) {
    if (!process.env[name]) {
        throw new Error(`required secret key is required ${name}`);
    }
    return process.env[name];
}
export const configEnv = {
    MONGO_URI: requireValue("MONGO_URI"),
    ACCESS_TOKEN_SECRET: requireValue("ACCESS_TOKEN_SECRET"),
    REFRESH_TOKEN_SECRET: requireValue("REFRESH_TOKEN_SECRET"),
    NODE_ENV: requireValue("NODE_ENV")
};
//# sourceMappingURL=env.js.map