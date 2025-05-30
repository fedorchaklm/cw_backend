import jwt from "jsonwebtoken";

import { config } from "../configs/config";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import { tokenRepository } from "../repositories/token.repository";

class TokenService {
    public generateTokens = (payload: ITokenPayload): ITokenPair => {
        const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
            expiresIn: config.JWT_ACCESS_LIFETIME,
        });
        const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
            expiresIn: config.JWT_REFRESH_LIFETIME,
        });
        return { accessToken, refreshToken };
    };

    public verifyToken = (
        token: string,
        type: "accessToken" | "refreshToken",
    ): ITokenPayload => {
        try {
            let secret;

            switch (type) {
                case "accessToken":
                    secret = config.JWT_ACCESS_SECRET;
                    break;
                case "refreshToken":
                    secret = config.JWT_REFRESH_SECRET;
                    break;
                default:
                    throw new ApiError(
                        "Invalid token type",
                        StatusCodesEnum.BAD_REQUEST,
                    );
            }

            return jwt.verify(token, secret) as ITokenPayload;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            throw new ApiError("Invalid token", StatusCodesEnum.UNAUTHORIZED);
        }
    };

    public isTokenExist = async (
        token: string,
        type: "accessToken" | "refreshToken",
    ): Promise<boolean> => {
        const iTokenPromise = await tokenRepository.findByParams({
            [type]: token,
        });
        return !!iTokenPromise;
    };
}

export const tokenService = new TokenService();
