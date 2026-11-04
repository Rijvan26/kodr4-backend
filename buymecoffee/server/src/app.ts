import cookieParser from "cookie-parser";
import express from "express";
import type { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import { configEnv } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";
import routes from "./routes/index.routes.js";
import paymentRouter from "./routes/payment.route.js";
import webhookRouter from "./routes/webhook.route.js";

const app: Application = express();

const allowedOrigins = [
    "https://setup-anymore-washhouse.ngrok-free.dev",
    "https://support-me000.vercel.app/",
    ...configEnv.CORS_ORIGINS,
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

// Uptime monitor & health check endpoints (Render, cron-job.org, UptimeRobot)
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root API status endpoint
app.get("/", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "supportme.com API is running",
        version: "1.0.0",
        health: "/health",
    });
});

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
