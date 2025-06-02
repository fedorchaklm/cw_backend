import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ITokenPair } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { authService } from "../services/auth.service";
import { tokenService } from "../services/token.service";
import { userService } from "../services/user.service";

class AuthController {
    public signUp = async (
        req: Request,
        res: Response<{ user: IUser; tokens: ITokenPair }>,
        next: NextFunction,
    ) => {
        try {
            const userWithTokens = await authService.signUp(req.body);
            res.status(StatusCodesEnum.CREATED).json(userWithTokens);
        } catch (e) {
            next(e);
        }
    };

    public signIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userWithTokens = await authService.signIn(req.body);
            res.status(StatusCodesEnum.CREATED).json(userWithTokens);
        } catch (e) {
            next(e);
        }
    };

    public me = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = res.locals.tokenPayload;
            const user = await userService.getById(userId);
            res.status(StatusCodesEnum.OK).json(user);
        } catch (e) {
            next(e);
        }
    };

    public refresh = async (_: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, role } = res.locals.tokenPayload;
            const tokens = tokenService.generateTokens({ userId, role });
            await tokenRepository.create({
                ...tokens,
                _userId: userId,
            });
            res.status(StatusCodesEnum.OK).json(tokens);
        } catch (e) {
            next(e);
        }
    };

    public activate = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { token } = req.params;
            const user = await authService.activate(token);
            res.status(StatusCodesEnum.OK).json(user);
        } catch (e) {
            next(e);
        }
    };

    public passwordRecoveryRequest = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { email } = req.params;
            const user = await userService.getByEmail(email);

            if (user) {
                await authService.passwordRecoveryRequest(user);
            }

            res.status(StatusCodesEnum.OK).json({
                details: "Check your email",
            });
        } catch (e) {
            next(e);
        }
    };

    public recoveryPassword = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            const user = authService.recoveryPassword(token, password);
            res.status(StatusCodesEnum.OK).json(user);
        } catch (e) {
            next(e);
        }
    };
}

export const authController = new AuthController();
