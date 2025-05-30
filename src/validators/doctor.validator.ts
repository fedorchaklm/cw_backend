import Joi from "joi";

export class DoctorValidator {
    private static name = Joi.string().min(3).max(20).trim();
    private static surname = Joi.string().regex(/^[A-Z][a-z]{1,9}$/);
    private static age = Joi.number().min(18).max(55);
    private static occupation = Joi.string().regex(/^[A-Z][a-z]{1,9}$/);
    private static email = Joi.string().email();

    public static create = Joi.object({
        name: this.name.required(),
        surname: this.surname.required(),
        age: this.age.required(),
        occupation: this.occupation.required(),
        email: this.email.required(),
    });

    public static update = Joi.object({
        name: this.name.required(),
        surname: this.surname.required(),
        age: this.age.required(),
        occupation: this.occupation.required(),
        email: this.email.required(),
    });
}
