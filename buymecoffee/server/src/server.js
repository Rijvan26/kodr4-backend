import app from "./app.js";
import { connectDb } from "./config/db.js";
await connectDb();
app.listen(3000, () => {
    console.log("server is running on port 3000");
});
//# sourceMappingURL=server.js.map