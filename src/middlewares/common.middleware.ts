import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";

class CommonMiddleware {
    public isValidate = (key: string) => {
        return (req: Request, _: Response, next: NextFunction) => {
            try {
                const id = req.params[key];
                if (!isObjectIdOrHexString(id)) {
                    throw new ApiError(
                        `Invalid ${key}: ${id}`,
                        StatusCodesEnum.BAD_REQUEST,
                    );
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    };

    public validateBody(validator: ObjectSchema) {
        return async (req: Request, _: Response, next: NextFunction) => {
            try {
                req.body = await validator.validateAsync(req.body);
                console.log(req.body, "validate");
                next();
            } catch (e) {
                // if (e instanceof Joi.ValidationError) {
                next(new ApiError(e.details[0].message, 400));
                // }
            }
        };
    }
}

export const commonMiddleware = new CommonMiddleware();
