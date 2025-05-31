import Joi from "joi";

import { RegexEnum } from "../enums/regex.enum";

export class AuthValidator {
    private static refreshToken = Joi.string().required();
    private static password = Joi.string().regex(RegexEnum.PASSWORD);

    public static refresh = Joi.object({
        refreshToken: this.refreshToken.required(),
    });

    public static validatePassword = Joi.object({
        password: this.password.required(),
    });
}
