import { OrderByEnum } from "../enums/query-order.enum";
import { IBase } from "./base.interface";

export interface IDoctor extends IBase {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    procedures: Array<string>;
    // age: number;
    // experience: number;
    // clinics: Array<string>;
    // isDeleted: boolean;
}

export interface IDoctorQuery {
    pageSize: number;
    page: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    orderBy?: OrderByEnum;
}

export type IDoctorCreateDTO = Omit<IDoctor, "_id" | "createdAt" | "updatedAt">;

export type IDoctorUpdateDTO = Partial<IDoctor>;
