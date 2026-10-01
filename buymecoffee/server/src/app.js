import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import { configEnv } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";
import routes from "./routes/index.routes.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(configEnv.NODE_ENV !== "prodcution" ? "combined" : "dev"));
app.use("/api/v1", routes);
app.use(notFound);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map