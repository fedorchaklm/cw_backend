import { IBase } from "./base.interface";

export interface IDoctor extends IBase {
    _id: string;
    name: string;
    surname: string;
    email: string;
    age: number;
    occupation: string;
    isDeleted: boolean;
}

export type IDoctorCreateDTO = Pick<
    IDoctor,
    "name" | "surname" | "age" | "email" | "occupation"
>;
