import { IBase } from "./base.interface";

export interface IProcedure extends IBase {
    _id: string;
    name: string;
}

export interface IProcedureQuery {
    pageSize: number;
    page: number;
    name?: string;
    orderBy?: string;
}

export type IProcedureCreateDTO = Omit<
    IProcedure,
    "_id" | "createdAt" | "updatedAt"
>;
