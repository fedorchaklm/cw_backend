import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IUser } from "../interfaces/user.interface";
import { userService } from "../services/user.service";

class UserController {
    public getAll = async (
        _: Request,
        res: Response<Array<IUser> | null>,
        next: NextFunction,
    ) => {
        try {
            const users = await userService.getAll();
            res.status(StatusCodesEnum.OK).json(users);
        } catch (e) {
            next(e);
        }
    };

    public getById = async (
        req: Request,
        res: Response<IUser | null>,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const user = await userService.getById(id);
            res.status(StatusCodesEnum.OK).json(user);
        } catch (e) {
            next(e);
        }
    };

    public create = async (
        req: Request,
        res: Response<IUser | null>,
        next: NextFunction,
    ) => {
        try {
            const user = await userService.create(req.body);
            res.status(StatusCodesEnum.CREATED).json(user);
        } catch (e) {
            next(e);
        }
    };

    public updateById = async (
        req: Request,
        res: Response<IUser | null>,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const user = await userService.updateById(id, req.body);
            res.status(StatusCodesEnum.OK).json(user);
        } catch (e) {
            next(e);
        }
    };

    public deleteById = async (
        req: Request,
        res: Response<void>,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            await userService.deleteById(id);
            res.status(StatusCodesEnum.NO_CONTENT).end();
        } catch (e) {
            next(e);
        }
    };
}

export const userController = new UserController();
