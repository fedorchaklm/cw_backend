import { DoctorQueryOrderEnum } from "../enums/doctor-query-order.enum";
import { IBase } from "./base.interface";

export interface IDoctor extends IBase {
    _id: string;
    name: string;
    surname: string;
    age: number;
    email: string;
    phone: string;
    specialty: string;
    experience: number;
    clinics: Array<string>;
    procedures: Array<string>;
    isDeleted: boolean;
}

export interface IDoctorQuery {
    pageSize: number;
    page: number;
    name?: string;
    surname?: string;
    email?: string;
    phone?: string;
    orderBy?: DoctorQueryOrderEnum;
}

export type IDoctorCreateDTO = Omit<IDoctor, "_id" | "isDeleted">;
