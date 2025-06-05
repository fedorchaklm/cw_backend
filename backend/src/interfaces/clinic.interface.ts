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
    procedure?: string;
    doctor?: string;
    orderBy?: string;
}

export type IClinicCreateDTO = Omit<IClinic, "_id" | "createdAt" | "updatedAt">;

export type IClinicUpdateDTO = Partial<IClinic>;
