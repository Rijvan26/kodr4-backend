import connectDB from "./src/config/db.js"
import app from "./src/app.js"
import dns from "node:dns"
dns.setServers(['1.1.1.1','8.8.8.8'])



 await connectDB()

app.listen(3000,() => {
    console.log("server is running on port 3000")
})