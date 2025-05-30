import Joi from "joi";

export class AuthValidator {
    private static refreshToken = Joi.string().required();

    public static refresh = Joi.object({
        refreshToken: this.refreshToken.required(),
    });
}
