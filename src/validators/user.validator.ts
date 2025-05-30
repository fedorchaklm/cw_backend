import Joi from "joi";

import { RegexEnum } from "../enums/regex.enum";

export class UserValidator {
    private static email = Joi.string().email().trim();
    private static password = Joi.string().regex(RegexEnum.PASSWORD);
    private static name = Joi.string().regex(RegexEnum.NAME);
    private static surname = Joi.string().regex(RegexEnum.NAME);

    public static create = Joi.object({
        email: this.email.required(),
        password: this.password.required(),
        name: this.name.required(),
        surname: this.surname.required(),
    });

    public static update = Joi.object({
        name: this.name.required(),
        surname: this.surname.required(),
    });
}
