import mongoose from "mongoose";
import { configEnv } from "./env.js";
import dns from "node:dns";
dns.setServers(['1.1.1.1', '8.8.8.8']);
export const connectDb = async () => {
    await mongoose.connect(configEnv.MONGO_URI);
    console.info("Database connected");
};
//# sourceMappingURL=db.js.map