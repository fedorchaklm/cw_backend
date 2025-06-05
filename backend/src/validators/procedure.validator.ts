import Joi from "joi";

import { RegexEnum } from "../enums/regex.enum";

export class ProcedureValidator {
    private static name = Joi.string().regex(RegexEnum.PROCEDURE_NAME);

    public static create = Joi.object({
        name: this.name.required(),
    });

    public static update = Joi.object({
        name: this.name.required(),
    });

    public static query = Joi.object({
        pageSize: Joi.number().min(1).max(100).default(10),
        page: Joi.number().min(1).default(1),
        name: Joi.string().trim(),
        // order: Joi.string().valid(
        //     ...Object.values(QueryOrderEnum),
        //     ...Object.values(QueryOrderEnum).map((item) => `-${item}`),
        // ),
    });
}
