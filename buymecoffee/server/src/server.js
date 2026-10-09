import app from "./app.js";
import { connectDb } from "./config/db.js";
const port = Number(process.env.PORT ?? "3000");
await connectDb();
app.listen(port, () => {
    console.info(`Server is listening on port ${port}`);
});
//# sourceMappingURL=server.js.map