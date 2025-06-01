import Joi from "joi";

import { DoctorQueryOrderEnum } from "../enums/doctor-query-order.enum";
import { RegexEnum } from "../enums/regex.enum";

export class DoctorValidator {
    private static name = Joi.string().regex(RegexEnum.NAME);
    private static surname = Joi.string().regex(RegexEnum.NAME);
    private static age = Joi.number().min(18).max(55);
    private static email = Joi.string().email();
    private static phone = Joi.string().regex(RegexEnum.PHONE);
    private static experience = Joi.number().min(1);
    private static clinics = Joi.array();
    private static procedures = Joi.array();

    public static create = Joi.object({
        name: this.name.required(),
        surname: this.surname.required(),
        age: this.age.required(),
        email: this.email.required(),
        phone: this.phone.required(),
        experience: this.experience.required(),
        clinics: this.clinics.required(),
        procedures: this.procedures.required(),
    });

    // public static update = Joi.object({
    //     name: this.name.required(),
    //     surname: this.surname.required(),
    //     age: this.age.required(),
    //     email: this.email.required(),
    //     phone: this.phone.required(),
    //     experience: this.experience.required(),
    //     clinics: this.clinics.required(),
    //     procedures: this.procedures.required(),
    // });

    public static query = Joi.object({
        pageSize: Joi.number().min(1).max(100).default(10),
        page: Joi.number().min(1).default(1),
        name: Joi.string().trim(),
        surname: Joi.string().trim(),
        email: Joi.string().trim(),
        phone: Joi.string().trim(),
        order: Joi.string().valid(
            ...Object.values(DoctorQueryOrderEnum),
            ...Object.values(DoctorQueryOrderEnum).map((item) => `-${item}`),
        ),
    });
}
