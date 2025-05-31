import Joi from "joi";

export class RecoveryValidator {
    private static email = Joi.string().email();

    public static emailValidate = Joi.object({
        email: this.email.required(),
    });
}
