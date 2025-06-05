import Joi from "joi";

import { OrderByEnum } from "../enums/query-order.enum";
import { RegexEnum } from "../enums/regex.enum";

export class ClinicValidator {
    private static name = Joi.string().regex(RegexEnum.PROCEDURE_NAME);
    private static doctors = Joi.array().items(Joi.string());

    public static create = Joi.object({
        name: this.name.required(),
        doctors: this.doctors.required(),
    });

    public static update = Joi.object({
        name: this.name,
        doctors: this.doctors,
    });

    public static query = Joi.object({
        pageSize: Joi.number().min(1).max(100).default(10),
        page: Joi.number().min(1).default(1),
        name: Joi.string().trim(),
        procedures: Joi.string().trim(),
        doctors: Joi.string().trim(),
        order: Joi.string().valid(
            ...Object.values(OrderByEnum),
            ...Object.values(OrderByEnum).map((item) => `-${item}`),
        ),
    });
}
