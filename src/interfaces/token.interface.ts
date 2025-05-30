import { RoleEnum } from "../enums/role.enum";
import { IBase } from "./base.interface";

export interface IToken extends IBase {
    _id: string;
    accessToken: string;
    refreshToken: string;
    _userId: string;
}

export interface ITokenPayload {
    userId: string;
    role: RoleEnum;
}

export interface ITokenPair {
    accessToken: string;
    refreshToken: string;
}
