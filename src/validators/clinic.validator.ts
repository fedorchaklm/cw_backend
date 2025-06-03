import Joi from "joi";

import { ProcedureQueryOrderEnum } from "../enums/procedure-query-order.enum";
import { RegexEnum } from "../enums/regex.enum";

export class ClinicValidator {
    private static name = Joi.string().regex(RegexEnum.PROCEDURE_NAME);
    private static doctors = Joi.array().items(Joi.string());
    // private static address = Joi.string().regex(RegexEnum.PROCEDURE_NAME);
    // private static phone = Joi.string().regex(RegexEnum.PHONE);
    // private static email = Joi.string().email();
    // private static description = Joi.string().regex(RegexEnum.PROCEDURE_NAME);
    // private static procedures = Joi.array();

    public static create = Joi.object({
        name: this.name.required(),
        doctors: this.doctors.required(),
        // address: this.address.required(),
        // phone: this.phone.required(),
        // email: this.email.required(),
        // description: this.description.required(),
        // procedures: this.procedures.required(),
    });

    public static update = Joi.object({
        name: this.name,
        doctors: this.doctors,
        // address: this.address.required(),
        // phone: this.phone.required(),
        // email: this.email.required(),
        // description: this.description.required(),
        // procedures: this.procedures.required(),
    });

    public static query = Joi.object({
        pageSize: Joi.number().min(1).max(100).default(10),
        page: Joi.number().min(1).default(1),
        name: Joi.string().trim(),
        procedures: Joi.string().trim(),
        doctors: Joi.string().trim(),
        order: Joi.string().valid(
            ...Object.values(ProcedureQueryOrderEnum),
            ...Object.values(ProcedureQueryOrderEnum).map((item) => `-${item}`),
        ),
    });
}
