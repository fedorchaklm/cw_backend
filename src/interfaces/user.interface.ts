import { IBase } from "./base.interface";

export interface IUser extends IBase {
    _id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: string;
    isDeleted: boolean;
    isVerified: boolean;
}

export type IUserCreateDTO = Pick<
    IUser,
    "name" | "surname" | "email" | "password"
>;

export type IUserUpdateDTO = Pick<IUser, "name" | "surname">;
