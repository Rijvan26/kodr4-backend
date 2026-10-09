import mongoose from "mongoose"
import { configEnv } from "./env.js"

export const connectDb = async ():Promise<void> => {
    await mongoose.connect(configEnv.MONGO_URI)

    console.info("Database connected")
}