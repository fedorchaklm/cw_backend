import { RoleEnum } from "../enums/role.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { IAuth } from "../interfaces/auth.interface";
import { ITokenPair } from "../interfaces/token.interface";
import { IUser, IUserCreateDTO } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

class AuthService {
    public signUp = async (
        user: IUserCreateDTO,
    ): Promise<{ user: IUser; tokens: ITokenPair }> => {
        await userService.isEmailUnique(user.email);
        const password = await passwordService.hashPassword(user.password);
        const newUser = await userService.create({ ...user, password });
        const tokens = tokenService.generateTokens({
            userId: newUser._id,
            role: newUser.role as RoleEnum,
        });
        await tokenRepository.create({ ...tokens, _userId: newUser._id });
        return { user: newUser, tokens };
    };

    public signIn = async (
        dto: IAuth,
    ): Promise<{ user: IUser; tokens: ITokenPair }> => {
        const user = await userRepository.findByEmail(dto.email);

        if (user === null) {
            throw new ApiError(
                "Invalid email or password",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        const isValidPassword = await passwordService.comparePassword(
            dto.password,
            user.password,
        );

        if (!isValidPassword) {
            throw new ApiError(
                "Invalid email or password",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        const tokens = tokenService.generateTokens({
            userId: user._id,
            role: user.role as RoleEnum,
        });
        await tokenRepository.create({ ...tokens, _userId: user._id });
        return { user, tokens };
    };
}

export const authService = new AuthService();
