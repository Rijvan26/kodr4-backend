import cookieParser from "cookie-parser";
import express from "express";
import  type { Application } from "express";
import morgan from "morgan";
import { configEnv } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";
import routes from "./routes/index.routes.js";
import paymentRouter from "./routes/payment.route.js";
import webhookRouter from "./routes/webhook.route.js";
import cors from "cors"
const app: Application = express();

app.use(cors({
    origin: "http://127.0.0.1:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use("/api/payment/webhook", webhookRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(configEnv.NODE_ENV !== "production" ? "combined" : "dev"));

app.use("/api/v1", routes);
app.use("/api/payment", paymentRouter);
app.use(notFound);
app.use(errorHandler);

export default app;