import app from "./app.ts";
import { connectDb } from "./config/db.js";
import { configEnv } from "./config/env.js";
import dns from "node:dns"
dns.setServers(['1.1.1.1','8.8.8.8'])


await connectDb()
app.listen(configEnv.PORT,() => {
    console.info(`Server is listening on port ${configEnv.PORT}`)
})