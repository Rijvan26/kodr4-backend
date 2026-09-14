import dns from "node:dns"
dns.setServers(['1.1.1.1','8.8.8.8'])
import app from "./src/app.js";
import connectToDb from "./src/config/db.js";

const startServer = async () => {
    try {
        await connectToDb()
        app.listen(3000, () => {
  console.log("Server is running on port 3000");
})
    } catch (error) {
        console.log("error in server starting")
        throw error
    }
}

startServer()