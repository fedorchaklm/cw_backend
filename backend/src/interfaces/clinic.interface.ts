import { IBase } from "./base.interface";

export interface IClinic extends IBase {
    _id: string;
    name: string;
    doctors: Array<string>;
}

export interface IClinicQuery {
    pageSize: number;
    page: number;
    name?: string;
    procedures?: string;
    doctors?: string;
    orderBy?: "name";
}

export type IClinicCreateDTO = Omit<IClinic, "_id" | "createdAt" | "updatedAt">;

export type IClinicUpdateDTO = Partial<IClinic>;
