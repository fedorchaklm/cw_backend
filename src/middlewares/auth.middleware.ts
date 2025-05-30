import { NextFunction, Request, Response } from "express";

import { RoleEnum } from "../enums/role.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { ITokenPayload } from "../interfaces/token.interface";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
    public checkAccessToken = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const authorizationHeader = req.headers.authorization;

            if (!authorizationHeader) {
                throw new ApiError(
                    "No token provided",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }

            const accessToken = authorizationHeader.split(" ")[1];

            if (!accessToken) {
                throw new ApiError(
                    "No token provided",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }
            const isTokenExist = await tokenService.isTokenExist(
                accessToken,
                "accessToken",
            );

            if (!isTokenExist) {
                throw new ApiError(
                    "Invalid token",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }

            const tokenPayload = tokenService.verifyToken(
                accessToken,
                "accessToken",
            );

            // req.res.locals.tokenPayload = tokenPayload;
            res.locals.tokenPayload = tokenPayload;

            next();
        } catch (e) {
            next(e);
        }
    };

    public checkRefreshToken = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const refreshToken = req.body.refreshToken;

            if (!refreshToken) {
                throw new ApiError(
                    "No refresh token provided",
                    StatusCodesEnum.FORBIDDEN,
                );
            }

            const isTokenExist = await tokenService.isTokenExist(
                refreshToken,
                "refreshToken",
            );

            if (!isTokenExist) {
                throw new ApiError(
                    "Invalid refresh token",
                    StatusCodesEnum.FORBIDDEN,
                );
            }

            const tokenPayload = tokenService.verifyToken(
                refreshToken,
                "refreshToken",
            );

            // req.res.locals.tokenPayload = tokenPayload;
            res.locals.tokenPayload = tokenPayload;

            next();
        } catch (e) {
            next(e);
        }
    };

    public isAdmin(_: Request, res: Response, next: NextFunction) {
        try {
            const { role } = res.locals.tokenPayload as ITokenPayload;

            if (role !== RoleEnum.ADMIN) {
                throw new ApiError(
                    "No has permissions",
                    StatusCodesEnum.FORBIDDEN,
                );
            }
            next();
        } catch (e) {
            next(e);
        }
    }
}

export const authMiddleware = new AuthMiddleware();
