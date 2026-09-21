const app = require("././src/app")
const dns = require("node:dns")
dns.setServers(['1.1.1.1','8.8.8.8'])

const connectDB = require("./src/config/database")

const startServer = async () => {
    try {
        await connectDB()
     app.listen(3000, () => {
    console.log("server is running on port 3000")
})
} catch(err) {
    console.error("Error starting server:", err)
    throw err
} }

startServer()