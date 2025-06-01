import { ClinicQueryOrderEnum } from "../enums/clinic-query-order.enum";
import { IBase } from "./base.interface";

export interface IClinic extends IBase {
    _id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    description: string;
    procedures: Array<string>;
    doctors: Array<string>;
    // isDeleted: boolean;
}

// export interface IClinicWithPopulate extends IBase {
//     _id: string;
//     name: string;
//     address: string;
//     phone: string;
//     email: string;
//     description: string;
//     isDeleted: boolean;
//     procedures: Array<IProcedure>;
//     doctors: Array<IDoctor>;
// }

export interface IClinicQuery {
    pageSize: number;
    page: number;
    name?: string;
    procedures?: string;
    doctors?: string;
    orderBy?: ClinicQueryOrderEnum;
}

export type IClinicCreateDTO = Omit<IClinic, "_id" | "isDeleted">;
