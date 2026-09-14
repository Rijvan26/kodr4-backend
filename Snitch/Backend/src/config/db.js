import mongoose from "mongoose";
import config from "./config.js"

const connectToDb = async () => {
    try {
        await mongoose.connect(config.MONGO_URI)
        console.log("MongoDB connected successfully")

    } catch (error) {
        console.log(error)
        throw error
    }
}

export default connectToDb