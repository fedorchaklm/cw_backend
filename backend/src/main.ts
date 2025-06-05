/*eslint-disable no-console */
import express, { NextFunction, Request, Response } from "express";
import { Server } from "http";
import mongoose from "mongoose";
import swaggerUI from "swagger-ui-express";

import { config } from "./configs/config";
import { swaggerDocument } from "./configs/swagger.config";
import { ApiError } from "./errors/api.error";
import { apiRouter } from "./routers/api.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/", apiRouter);

app.use(
    "*",
    (err: ApiError, req: Request, res: Response, next: NextFunction) => {
        const status = err.status || 500;
        const message = err.message ?? "Something went wrong";
        res.status(status).json({ status, message });
    },
);
process.on("uncaughtException", (err) => {
    console.log("uncaughtException", err);
    process.exit(1);
});

const dbConnection = async () => {
    try {
        console.log("Connecting to DB...", config.MONGO_URI);
        await mongoose.connect(config.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (e) {
        console.error("MongoDB connection failed");
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    await mongoose.connection.close();
};

let server: Server;

export const startServer = async () => {
    await dbConnection();
    server = app.listen(config.PORT, () => {
        console.log(`Server is running on http://localhost:${config.PORT}`);
    });
    return server;
};

export const stopServer = async () => {
    if (server != null) {
        server.close();
    }
    await disconnectDB();
};

if (config.ENV !== "test") {
    startServer();
}

export default app;
