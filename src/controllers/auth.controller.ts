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

    public me = async (_: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = res.locals.tokenPayload;
            const user = await userService.getById(id);
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
}

export const authController = new AuthController();
