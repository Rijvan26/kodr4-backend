import mongoose from "mongoose"
import config from "./config.js"

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI, {
         
        })
        console.log("MongoDB connected successfully")
    } catch(err) {
        console.error("MongoDB connection error:", err)
        throw err
    }
}

export default connectDB