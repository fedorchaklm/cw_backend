import Joi from "joi";

import { OrderByEnum } from "../enums/query-order.enum";
import { RegexEnum } from "../enums/regex.enum";

export class DoctorValidator {
    private static name = Joi.string().regex(RegexEnum.NAME);
    private static surname = Joi.string().regex(RegexEnum.NAME);
    private static email = Joi.string().email();
    private static phone = Joi.string().regex(RegexEnum.PHONE);
    private static procedures = Joi.array().items(Joi.string());
    // private static age = Joi.number().min(18).max(55);
    // private static experience = Joi.number().min(1);
    // private static clinics = Joi.array();

    public static create = Joi.object({
        firstName: this.name.required(),
        lastName: this.surname.required(),
        email: this.email.required(),
        phone: this.phone.required(),
        procedures: this.procedures.required(),
        // age: this.age.required(),
        // experience: this.experience.required(),
        // clinics: this.clinics.required(),
    });

    public static update = Joi.object({
        firstName: this.name,
        lastName: this.surname,
        email: this.email,
        phone: this.phone,
        procedures: this.procedures,
        // age: this.age.required(),
        // experience: this.experience.required(),
        // clinics: this.clinics.required(),
    });

    public static query = Joi.object({
        pageSize: Joi.number().min(1).max(100).default(10),
        page: Joi.number().min(1).default(1),
        firstName: Joi.string().trim(),
        lastName: Joi.string().trim(),
        email: Joi.string().trim(),
        phone: Joi.string().trim(),
        orderBy: Joi.string().valid(
            ...Object.values(OrderByEnum),
            ...Object.values(OrderByEnum).map((item) => `-${item}`),
        ),
    });
}
