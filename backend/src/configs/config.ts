import dotenv from "dotenv";

const environment = process.env.NODE_ENV ?? "production";

dotenv.config({
    path: `../.env.${environment}`,
});

interface IConfig {
    ENV: string;
    PORT: string;
    MONGO_URI: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_LIFETIME: any;
    JWT_REFRESH_LIFETIME: any;
    EMAIL_USER: string;
    EMAIL_PASSWORD: string;
    JWT_ACTIVATE_SECRET: string;
    JWT_RECOVERY_SECRET: string;
    JWT_ACTIVATE_LIFETIME: any;
    JWT_RECOVERY_LIFETIME: any;
    FRONTEND_URL: string;
}

export const config: IConfig = {
    ENV: environment,
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI ?? "mongodb://localhost:27017",
    // MONGO_URI: process.env.MONGO_URI ?? 'mongodb://localhost:27017',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_LIFETIME: process.env.JWT_ACCESS_LIFETIME,
    JWT_REFRESH_LIFETIME: process.env.JWT_REFRESH_LIFETIME,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    JWT_ACTIVATE_SECRET: process.env.JWT_ACTIVATE_SECRET,
    JWT_RECOVERY_SECRET: process.env.JWT_RECOVERY_SECRET,
    JWT_ACTIVATE_LIFETIME: process.env.JWT_ACTIVATE_LIFETIME,
    JWT_RECOVERY_LIFETIME: process.env.JWT_RECOVERY_LIFETIME,
    FRONTEND_URL: process.env.FRONTEND_URL,
};
