const mongoose = require("mongoose")
const config = require("./config")

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

module.exports = connectDB